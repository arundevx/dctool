from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response, JSONResponse
from io import BytesIO
from typing import List
import zipfile
import os
import tempfile
from PyPDF2 import PdfWriter, PdfReader
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from pdf2docx import Converter
except ImportError:
    Converter = None

try:
    from docx import Document
except ImportError:
    Document = None

router = APIRouter(prefix="/pdfs", tags=["pdfs"])

MAX_PDF_SIZE = 50 * 1024 * 1024  # 50 MB
MAX_DOCX_SIZE = 25 * 1024 * 1024


def _read_pdf(contents: bytes) -> PdfReader:
    if len(contents) > MAX_PDF_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    try:
        return PdfReader(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")


def _pdf_response(data: bytes, filename: str) -> Response:
    return Response(
        content=data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _zip_response(data: bytes, filename: str) -> Response:
    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _docx_response(data: bytes, filename: str) -> Response:
    return Response(
        content=data,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _parse_page_ranges(spec: str, total_pages: int) -> List[int]:
    pages: set[int] = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            start_str, end_str = part.split("-", 1)
            start = int(start_str)
            end = int(end_str)
            if start > end:
                start, end = end, start
            for page_num in range(start, end + 1):
                if 1 <= page_num <= total_pages:
                    pages.add(page_num - 1)
        else:
            page_num = int(part)
            if 1 <= page_num <= total_pages:
                pages.add(page_num - 1)
    return sorted(pages)


def _create_page_number_overlay(text: str, width: float, height: float, position: str, font_size: int):
    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    c.setFont("Helvetica", font_size)
    text_width = c.stringWidth(text, "Helvetica", font_size)
    padding = 24

    if position == "top-left":
        x, y = padding, height - padding - font_size
    elif position == "top-right":
        x, y = width - text_width - padding, height - padding - font_size
    elif position == "top-center":
        x, y = (width - text_width) / 2, height - padding - font_size
    elif position == "bottom-left":
        x, y = padding, padding
    elif position == "bottom-center":
        x, y = (width - text_width) / 2, padding
    else:
        x, y = width - text_width - padding, padding

    c.drawString(x, y, text)
    c.save()
    packet.seek(0)
    return PdfReader(packet).pages[0]


def _create_text_watermark_page(text: str, width: float, height: float, position: str, opacity: int, font_size: int):
    packet = BytesIO()
    c = canvas.Canvas(packet, pagesize=(width, height))
    c.setFillAlpha(max(0.05, min(1.0, opacity / 100)))
    c.setFont("Helvetica-Bold", font_size)
    text_width = c.stringWidth(text, "Helvetica-Bold", font_size)
    padding = 36

    def draw_rotated(angle: float, x: float, y: float, align: str = "left"):
        c.saveState()
        c.translate(x, y)
        c.rotate(angle)
        if align == "right":
            c.drawRightString(0, 0, text)
        else:
            c.drawString(0, 0, text)
        c.restoreState()

    if position == "top-left":
        x, y = padding, height - padding - font_size
        c.drawString(x, y, text)
    elif position == "top-right":
        x, y = width - text_width - padding, height - padding - font_size
        c.drawString(x, y, text)
    elif position == "bottom-left":
        x, y = padding, padding
        c.drawString(x, y, text)
    elif position == "center":
        x, y = (width - text_width) / 2, height / 2
        c.drawString(x, y, text)
    elif position == "diagonal-bl-tr":
        draw_rotated(45, padding, padding)
    elif position == "diagonal-br-tl":
        draw_rotated(-45, width - padding, padding, "right")
    elif position == "diagonal-tl-br":
        draw_rotated(-45, padding, height - padding - font_size)
    elif position == "diagonal-tr-bl":
        draw_rotated(45, width - padding, height - padding - font_size, "right")
    elif position == "edge-left":
        draw_rotated(90, padding + font_size, padding)
    elif position == "edge-right":
        draw_rotated(90, width - padding, padding, "right")
    else:
        x, y = width - text_width - padding, padding
        c.drawString(x, y, text)

    c.save()
    packet.seek(0)
    return PdfReader(packet).pages[0]


def _docx_to_pdf_bytes(docx_bytes: bytes) -> bytes:
    if not Document:
        raise HTTPException(status_code=501, detail="python-docx is not installed on this server.")

    doc = Document(BytesIO(docx_bytes))
    buffer = BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter, topMargin=inch, bottomMargin=inch)
    styles = getSampleStyleSheet()
    story = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if text:
            story.append(Paragraph(text.replace("&", "&amp;").replace("<", "&lt;"), styles["Normal"]))
            story.append(Spacer(1, 0.12 * inch))

    if not story:
        story.append(Paragraph("(Empty document)", styles["Normal"]))

    pdf.build(story)
    buffer.seek(0)
    return buffer.getvalue()


def _pdf_to_image_bytes(contents: bytes, fmt: str, dpi: int) -> List[bytes]:
    if not fitz:
        raise HTTPException(status_code=501, detail="PyMuPDF is not installed on this server.")

    doc = fitz.open(stream=contents, filetype="pdf")
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    images: List[bytes] = []

    try:
        for page in doc:
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            if fmt == "jpeg":
                images.append(pix.tobytes("jpeg", jpg_quality=90))
            else:
                images.append(pix.tobytes("png"))
    finally:
        doc.close()

    return images


@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge")

    merger = PdfWriter()
    try:
        for file in files:
            contents = await file.read()
            reader = _read_pdf(contents)
            merger.append(reader)

        output = BytesIO()
        merger.write(output)
        output.seek(0)
        return _pdf_response(output.getvalue(), "merged_document.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        merger.close()


@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        writer = PdfWriter()
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        filename = (file.filename or "document").rsplit(".", 1)[0] + "_compressed.pdf"
        return _pdf_response(output.getvalue(), filename)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/split")
async def split_pdf(
    file: UploadFile = File(...),
    mode: str = Form("extract"),
    pages: str = Form(""),
):
    if mode not in {"extract", "each"}:
        raise HTTPException(status_code=400, detail="Mode must be 'extract' or 'each'")

    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        total = len(reader.pages)
        base = (file.filename or "document").rsplit(".", 1)[0]

        if mode == "each":
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
                for idx, page in enumerate(reader.pages, start=1):
                    writer = PdfWriter()
                    writer.add_page(page)
                    page_buffer = BytesIO()
                    writer.write(page_buffer)
                    zf.writestr(f"page_{idx}.pdf", page_buffer.getvalue())
            zip_buffer.seek(0)
            return _zip_response(zip_buffer.getvalue(), f"{base}_split.zip")

        if not pages.strip():
            raise HTTPException(status_code=400, detail="Enter page ranges, e.g. 1-3,5,7")

        selected = _parse_page_ranges(pages, total)
        if not selected:
            raise HTTPException(status_code=400, detail="No valid pages selected")

        writer = PdfWriter()
        for idx in selected:
            writer.add_page(reader.pages[idx])
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        return _pdf_response(output.getvalue(), f"{base}_extracted.pdf")
    except HTTPException:
        raise
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid page range format. Use e.g. 1-3,5,7")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-images")
async def pdf_to_images(
    file: UploadFile = File(...),
    image_format: str = Form("png"),
    dpi: int = Form(150),
):
    if not fitz:
        raise HTTPException(status_code=501, detail="PyMuPDF is not installed on this server.")
    if image_format.lower() not in {"png", "jpeg", "jpg"}:
        raise HTTPException(status_code=400, detail="Image format must be png or jpeg")
    if dpi < 72 or dpi > 300:
        raise HTTPException(status_code=400, detail="DPI must be between 72 and 300")

    contents = await file.read()
    try:
        _read_pdf(contents)
        fmt = "jpeg" if image_format.lower() in {"jpeg", "jpg"} else "png"
        images = _pdf_to_image_bytes(contents, fmt, dpi)
        base = (file.filename or "document").rsplit(".", 1)[0]
        ext = "jpg" if fmt == "jpeg" else "png"

        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for idx, image_bytes in enumerate(images, start=1):
                zf.writestr(f"page_{idx}.{ext}", image_bytes)

        zip_buffer.seek(0)
        return _zip_response(zip_buffer.getvalue(), f"{base}_images.zip")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to images: {str(e)}")


@router.post("/to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    if not Converter:
        raise HTTPException(status_code=501, detail="pdf2docx is not installed on this server.")

    contents = await file.read()
    pdf_path = None
    docx_path = None
    try:
        _read_pdf(contents)
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
            tmp_pdf.write(contents)
            pdf_path = tmp_pdf.name
        docx_path = pdf_path.replace(".pdf", ".docx")

        converter = Converter(pdf_path)
        converter.convert(docx_path)
        converter.close()

        with open(docx_path, "rb") as docx_file:
            docx_bytes = docx_file.read()

        base = (file.filename or "document").rsplit(".", 1)[0]
        return _docx_response(docx_bytes, f"{base}.docx")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to convert PDF to Word: {str(e)}")
    finally:
        for path in (pdf_path, docx_path):
            if path and os.path.exists(path):
                try:
                    os.unlink(path)
                except OSError:
                    pass


@router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Please upload a .docx file")

    contents = await file.read()
    if len(contents) > MAX_DOCX_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        pdf_bytes = _docx_to_pdf_bytes(contents)
        base = file.filename.rsplit(".", 1)[0]
        return _pdf_response(pdf_bytes, f"{base}.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to convert Word to PDF: {str(e)}")


@router.post("/watermark")
async def watermark_pdf(
    file: UploadFile = File(...),
    text: str = Form(...),
    position: str = Form("bottom-right"),
    opacity: int = Form(30),
    font_size: int = Form(36),
):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Watermark text cannot be empty")

    valid_positions = {
        "top-left", "top-right", "bottom-left", "bottom-right", "center",
        "diagonal-bl-tr", "diagonal-br-tl", "diagonal-tl-br", "diagonal-tr-bl",
        "edge-left", "edge-right",
    }
    if position not in valid_positions:
        raise HTTPException(status_code=400, detail="Invalid position")
    if opacity < 5 or opacity > 100:
        raise HTTPException(status_code=400, detail="Opacity must be between 5 and 100")

    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        writer = PdfWriter()

        for page in reader.pages:
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            watermark_page = _create_text_watermark_page(text.strip(), width, height, position, opacity, font_size)
            page.merge_page(watermark_page)
            writer.add_page(page)

        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_watermarked.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rotate")
async def rotate_pdf(
    file: UploadFile = File(...),
    angle: int = Form(90),
):
    if angle not in {90, 180, 270}:
        raise HTTPException(status_code=400, detail="Angle must be 90, 180, or 270")

    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        writer = PdfWriter()
        for page in reader.pages:
            page.rotate(angle)
            writer.add_page(page)
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_rotated.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/page-numbers")
async def add_page_numbers(
    file: UploadFile = File(...),
    position: str = Form("bottom-center"),
    start_number: int = Form(1),
    font_size: int = Form(12),
):
    valid_positions = {
        "top-left", "top-right", "top-center",
        "bottom-left", "bottom-right", "bottom-center",
    }
    if position not in valid_positions:
        raise HTTPException(status_code=400, detail="Invalid position")
    if start_number < 1:
        raise HTTPException(status_code=400, detail="Start number must be at least 1")
    if font_size < 8 or font_size > 48:
        raise HTTPException(status_code=400, detail="Font size must be between 8 and 48")

    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        writer = PdfWriter()

        for i, page in enumerate(reader.pages):
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            num_text = str(start_number + i)
            overlay = _create_page_number_overlay(num_text, width, height, position, font_size)
            page.merge_page(overlay)
            writer.add_page(page)

        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_numbered.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-text")
async def pdf_to_text(file: UploadFile = File(...)):
    if not fitz:
        raise HTTPException(status_code=501, detail="PyMuPDF is not installed on this server.")

    contents = await file.read()
    try:
        _read_pdf(contents)
        doc = fitz.open(stream=contents, filetype="pdf")
        text_parts: List[str] = []
        try:
            for page in doc:
                text_parts.append(page.get_text())
        finally:
            doc.close()

        text = "\n\n".join(part.strip() for part in text_parts if part.strip())
        if not text:
            text = "(No extractable text found in this PDF)"

        base = (file.filename or "document").rsplit(".", 1)[0]
        return Response(
            content=text.encode("utf-8"),
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{base}.txt"'},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")


@router.post("/reorder")
async def reorder_pdf(
    file: UploadFile = File(...),
    page_order: str = Form(...),
):
    if not page_order.strip():
        raise HTTPException(status_code=400, detail="Enter page order, e.g. 3,1,2,4")

    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        total = len(reader.pages)
        try:
            order = [int(p.strip()) - 1 for p in page_order.split(",") if p.strip()]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid page order. Use comma-separated numbers.")

        if not order:
            raise HTTPException(status_code=400, detail="No pages specified")
        if len(order) != len(set(order)):
            raise HTTPException(status_code=400, detail="Duplicate page numbers in order")
        for idx in order:
            if idx < 0 or idx >= total:
                raise HTTPException(status_code=400, detail=f"Page {idx + 1} is out of range (1-{total})")

        writer = PdfWriter()
        for idx in order:
            writer.add_page(reader.pages[idx])
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_reordered.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sign")
async def sign_pdf(
    file: UploadFile = File(...),
    signature: UploadFile = File(...),
    page_number: int = Form(-1),
    position: str = Form("bottom-right"),
    width: int = Form(150),
    height: int = Form(0),
    x: str = Form(""),
    y: str = Form(""),
):
    if not fitz:
        raise HTTPException(status_code=501, detail="PyMuPDF is not installed on this server.")

    valid_positions = {"bottom-right", "bottom-left", "top-right", "top-left", "center", "custom"}
    if position not in valid_positions:
        raise HTTPException(status_code=400, detail="Invalid position")

    contents = await file.read()
    sig_bytes = await signature.read()
    try:
        _read_pdf(contents)
        sig_img = Image.open(BytesIO(sig_bytes))
        sig_w, sig_h = sig_img.size
        aspect = sig_h / sig_w if sig_w else 1
        sig_height = height if height > 0 else int(width * aspect)
        if width > 0 and sig_height > 0 and (sig_w != width or sig_h != sig_height):
            sig_img = sig_img.resize((width, sig_height), Image.Resampling.LANCZOS)

        doc = fitz.open(stream=contents, filetype="pdf")
        try:
            page_idx = len(doc) - 1 if page_number < 1 else min(page_number - 1, len(doc) - 1)
            page = doc[page_idx]
            rect = page.rect
            padding = 36

            if position == "custom" and x.strip() and y.strip():
                x1, y1 = float(x), float(y)
                x1 = max(0, min(x1, rect.width - width))
                y1 = max(0, min(y1, rect.height - sig_height))
            elif position == "top-left":
                x1, y1 = padding, padding
            elif position == "top-right":
                x1, y1 = rect.width - width - padding, padding
            elif position == "bottom-left":
                x1, y1 = padding, rect.height - sig_height - padding
            elif position == "center":
                x1, y1 = (rect.width - width) / 2, (rect.height - sig_height) / 2
            else:
                x1, y1 = rect.width - width - padding, rect.height - sig_height - padding

            sig_buf = BytesIO()
            if sig_img.mode == "RGBA":
                sig_img.save(sig_buf, format="PNG")
            else:
                sig_img.convert("RGB").save(sig_buf, format="PNG")
            sig_buf.seek(0)

            page.insert_image(
                fitz.Rect(x1, y1, x1 + width, y1 + sig_height),
                stream=sig_buf.getvalue(),
            )

            out = BytesIO()
            doc.save(out)
            out.seek(0)
        finally:
            doc.close()

        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(out.getvalue(), f"{base}_signed.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sign PDF: {str(e)}")


@router.post("/images-to-pdf")
async def images_to_pdf(files: List[UploadFile] = File(...)):
    if not fitz:
        raise HTTPException(status_code=501, detail="PyMuPDF is not installed on this server.")
    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one image")

    try:
        doc = fitz.open()
        for upload in files:
            contents = await upload.read()
            if len(contents) > MAX_PDF_SIZE:
                raise HTTPException(status_code=413, detail="Image file too large")
            pil = Image.open(BytesIO(contents))
            if pil.mode in ("RGBA", "P", "LA"):
                bg = Image.new("RGB", pil.size, (255, 255, 255))
                if pil.mode == "P":
                    pil = pil.convert("RGBA")
                bg.paste(pil, mask=pil.split()[-1] if pil.mode == "RGBA" else None)
                pil = bg
            elif pil.mode != "RGB":
                pil = pil.convert("RGB")

            w, h = pil.size
            page = doc.new_page(width=w, height=h)
            buf = BytesIO()
            pil.save(buf, format="PNG")
            page.insert_image(page.rect, stream=buf.getvalue())

        out = BytesIO()
        doc.save(out)
        doc.close()
        out.seek(0)
        return _pdf_response(out.getvalue(), "images.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create PDF: {str(e)}")

@router.post("/protect")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.encrypt(password)
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_protected.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/unlock")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    contents = await file.read()
    if len(contents) > MAX_PDF_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    try:
        reader = PdfReader(BytesIO(contents))
        if not reader.is_encrypted:
            raise HTTPException(status_code=400, detail="PDF is not encrypted")
        
        # Try to decrypt
        result = reader.decrypt(password)
        if result == 0:  # Failed to decrypt
            raise HTTPException(status_code=401, detail="Incorrect password")
            
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
            
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        base = (file.filename or "document").rsplit(".", 1)[0]
        return _pdf_response(output.getvalue(), f"{base}_unlocked.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to unlock PDF: {str(e)}")

@router.post("/metadata")
async def get_pdf_metadata(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        reader = _read_pdf(contents)
        meta = reader.metadata
        if not meta:
            return JSONResponse({"metadata": {}})
            
        return JSONResponse({"metadata": {
            "title": meta.title,
            "author": meta.author,
            "subject": meta.subject,
            "creator": meta.creator,
            "producer": meta.producer,
            "creation_date": meta.creation_date_raw if hasattr(meta, "creation_date_raw") else getattr(meta, "/CreationDate", None),
            "modification_date": meta.modification_date_raw if hasattr(meta, "modification_date_raw") else getattr(meta, "/ModDate", None)
        }})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
