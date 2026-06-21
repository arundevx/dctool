from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from typing import List
from io import BytesIO
from PyPDF2 import PdfWriter, PdfReader

router = APIRouter(prefix="/pdfs", tags=["pdfs"])

MAX_PDF_SIZE = 50 * 1024 * 1024  # 50 MB

@router.post("/merge")
async def merge_pdfs(
    files: List[UploadFile] = File(...)
):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge")

    merger = PdfWriter()
    
    try:
        for file in files:
            contents = await file.read()
            if len(contents) > MAX_PDF_SIZE:
                raise HTTPException(status_code=413, detail=f"File {file.filename} is too large")
            
            reader = PdfReader(BytesIO(contents))
            merger.append(reader)
            
        output = BytesIO()
        merger.write(output)
        output.seek(0)
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="merged_document.pdf"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        merger.close()

@router.post("/compress")
async def compress_pdf(
    file: UploadFile = File(...)
):
    # Basic compression using PyPDF2 (remove duplication and standard compression)
    # True PDF compression often requires ghostscript, but this provides a simple pure python approach
    contents = await file.read()
    if len(contents) > MAX_PDF_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
        
    try:
        reader = PdfReader(BytesIO(contents))
        writer = PdfWriter()
        
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
            
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        
        filename = file.filename.rsplit(".", 1)[0] + "_compressed.pdf"
        
        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
