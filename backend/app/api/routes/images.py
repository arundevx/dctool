from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response, JSONResponse
from io import BytesIO
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

router = APIRouter(prefix="/images", tags=["images"])

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_DIMENSION = 8000


def _read_image(contents: bytes) -> Image.Image:
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")
    try:
        return Image.open(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")


def _save_image(img: Image.Image, original_filename: str, suffix: str) -> Response:
    ext_hint = (original_filename or "").rsplit(".", 1)[-1].lower() if original_filename and "." in original_filename else ""
    fmt = img.format
    if not fmt:
        if ext_hint in ("jpg", "jpeg"):
            fmt = "JPEG"
        elif ext_hint == "webp":
            fmt = "WEBP"
        else:
            fmt = "PNG"
    if fmt not in ["JPEG", "WEBP", "PNG"]:
        if img.mode in ("RGBA", "P", "LA"):
            fmt = "PNG"
        else:
            fmt = "JPEG"

    if fmt == "JPEG" and img.mode in ("RGBA", "P", "LA"):
        img = img.convert("RGB")

    output = BytesIO()
    if fmt == "PNG":
        img.save(output, format=fmt, optimize=True)
    else:
        img.save(output, format=fmt, quality=90, optimize=True)
    output.seek(0)

    ext = "jpg" if fmt == "JPEG" else fmt.lower()
    base = original_filename.rsplit(".", 1)[0] if original_filename else "image"
    filename = f"{base}_{suffix}.{ext}"

    return Response(
        content=output.getvalue(),
        media_type=f"image/{ext}",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


def _get_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_paths = [
        "arial.ttf",
        "Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
    ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _parse_hex_color(color: str) -> tuple[int, int, int]:
    color = color.strip().lstrip("#")
    if len(color) != 6:
        raise HTTPException(status_code=400, detail="Invalid color. Use hex format like #FFFFFF")
    try:
        return tuple(int(color[i : i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid color. Use hex format like #FFFFFF")


WATERMARK_POSITIONS = {
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "center",
    "diagonal-bl-tr",
    "diagonal-br-tl",
    "diagonal-tl-br",
    "diagonal-tr-bl",
    "edge-left",
    "edge-right",
}


def _text_layer(text: str, font, fill: tuple[int, int, int, int]) -> Image.Image:
    measure = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    bbox = measure.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad = 4
    layer = Image.new("RGBA", (tw + pad * 2, th + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((pad, pad), text, font=font, fill=fill)
    return layer


def _paste_rotated_text(overlay: Image.Image, rotated: Image.Image, x: int, y: int):
    overlay.paste(rotated, (x, y), rotated)


def _apply_watermark_text(overlay: Image.Image, img: Image.Image, text: str, font, fill: tuple[int, int, int, int], position: str, padding: int = 20):
    draw = ImageDraw.Draw(overlay)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    w, h = img.size

    if position == "top-left":
        draw.text((padding, padding), text, font=font, fill=fill)
    elif position == "top-right":
        draw.text((w - text_w - padding, padding), text, font=font, fill=fill)
    elif position == "bottom-left":
        draw.text((padding, h - text_h - padding), text, font=font, fill=fill)
    elif position == "center":
        draw.text(((w - text_w) // 2, (h - text_h) // 2), text, font=font, fill=fill)
    elif position == "diagonal-bl-tr":
        rotated = _text_layer(text, font, fill).rotate(45, expand=True, resample=Image.Resampling.BICUBIC)
        _paste_rotated_text(overlay, rotated, padding, h - padding - rotated.height)
    elif position == "diagonal-br-tl":
        rotated = _text_layer(text, font, fill).rotate(-45, expand=True, resample=Image.Resampling.BICUBIC)
        overlay.paste(rotated, (w - padding - rotated.width, h - padding - rotated.height), rotated)
    elif position == "diagonal-tl-br":
        rotated = _text_layer(text, font, fill).rotate(-45, expand=True, resample=Image.Resampling.BICUBIC)
        overlay.paste(rotated, (padding, padding), rotated)
    elif position == "diagonal-tr-bl":
        rotated = _text_layer(text, font, fill).rotate(45, expand=True, resample=Image.Resampling.BICUBIC)
        overlay.paste(rotated, (w - padding - rotated.width, padding), rotated)
    elif position == "edge-left":
        rotated = _text_layer(text, font, fill).rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
        overlay.paste(rotated, (padding, h - padding - rotated.height), rotated)
    elif position == "edge-right":
        rotated = _text_layer(text, font, fill).rotate(-90, expand=True, resample=Image.Resampling.BICUBIC)
        overlay.paste(rotated, (w - padding - rotated.width, padding), rotated)
    else:
        draw.text((w - text_w - padding, h - text_h - padding), text, font=font, fill=fill)


def _redact_rect(img: Image.Image, left: int, top: int, width: int, height: int, mode: str, blur_radius: int):
    right = min(left + width, img.width)
    bottom = min(top + height, img.height)
    left = max(0, min(left, img.width - 1))
    top = max(0, min(top, img.height - 1))
    if right <= left or bottom <= top:
        return

    region = img.crop((left, top, right, bottom))
    if mode == "blur":
        radius = max(1, min(blur_radius, 50))
        processed = region.filter(ImageFilter.GaussianBlur(radius=radius))
    else:
        processed = Image.new("RGB", region.size, (0, 0, 0))
    img.paste(processed, (left, top))

@router.post("/convert")
async def convert_image(
    file: UploadFile = File(...),
    target_format: str = Form(...)
):
    valid_formats = ["JPEG", "PNG", "WEBP"]
    target_format = target_format.upper()
    if target_format == "JPG":
        target_format = "JPEG"

    if target_format not in valid_formats:
        raise HTTPException(status_code=400, detail="Invalid target format")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        img = _read_image(contents)
        
        # Convert RGBA to RGB if saving as JPEG
        if target_format == "JPEG" and img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        output = BytesIO()
        img.save(output, format=target_format, quality=85)
        output.seek(0)
        
        ext = target_format.lower()
        filename = file.filename.rsplit(".", 1)[0] + f".{ext}"
        
        return Response(
            content=output.getvalue(),
            media_type=f"image/{ext}",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = Form(60)
):
    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        img = _read_image(contents)
        fmt = img.format
        if fmt not in ["JPEG", "WEBP", "PNG"]:
            # Fallback to JPEG for compression if format doesn't support quality
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            fmt = "JPEG"
        
        output = BytesIO()
        if fmt == "PNG":
            # PNG is lossless, so we use optimize
            img.save(output, format=fmt, optimize=True)
        else:
            img.save(output, format=fmt, quality=quality, optimize=True)
            
        output.seek(0)
        
        ext = fmt.lower()
        filename = file.filename.rsplit(".", 1)[0] + f"_compressed.{ext}"
        
        return Response(
            content=output.getvalue(),
            media_type=f"image/{ext}",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import io
try:
    from rembg import remove
except ImportError:
    remove = None

@router.post("/remove-bg")
async def remove_background(
    file: UploadFile = File(...)
):
    if not remove:
        raise HTTPException(status_code=501, detail="Background removal is not installed on this server.")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    try:
        # Pass bytes to rembg.remove
        output_bytes = remove(contents)
        
        filename = file.filename.rsplit(".", 1)[0] + "_nobg.png"
        
        return Response(
            content=output_bytes,
            media_type="image/png",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")


@router.post("/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...),
    maintain_aspect: bool = Form(True),
):
    if width < 1 or height < 1:
        raise HTTPException(status_code=400, detail="Width and height must be at least 1 pixel")
    if width > MAX_DIMENSION or height > MAX_DIMENSION:
        raise HTTPException(status_code=400, detail=f"Maximum dimension is {MAX_DIMENSION}px")

    contents = await file.read()
    try:
        img = _read_image(contents)
        original_w, original_h = img.size

        if maintain_aspect:
            ratio = min(width / original_w, height / original_h)
            new_w = max(1, int(original_w * ratio))
            new_h = max(1, int(original_h * ratio))
        else:
            new_w, new_h = width, height

        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        return _save_image(resized, file.filename or "image", f"resized_{new_w}x{new_h}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/crop")
async def crop_image(
    file: UploadFile = File(...),
    left: int = Form(...),
    top: int = Form(...),
    crop_width: int = Form(...),
    crop_height: int = Form(...),
):
    if crop_width < 1 or crop_height < 1:
        raise HTTPException(status_code=400, detail="Crop width and height must be at least 1 pixel")

    contents = await file.read()
    try:
        img = _read_image(contents)
        img_w, img_h = img.size

        if left < 0 or top < 0:
            raise HTTPException(status_code=400, detail="Crop position cannot be negative")
        if left + crop_width > img_w or top + crop_height > img_h:
            raise HTTPException(
                status_code=400,
                detail=f"Crop area exceeds image bounds ({img_w}x{img_h})",
            )

        cropped = img.crop((left, top, left + crop_width, top + crop_height))
        return _save_image(cropped, file.filename or "image", f"cropped_{crop_width}x{crop_height}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/watermark")
async def watermark_image(
    file: UploadFile = File(...),
    text: str = Form(...),
    position: str = Form("bottom-right"),
    opacity: int = Form(50),
    font_size: int = Form(36),
    color: str = Form("#FFFFFF"),
):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Watermark text cannot be empty")
    if opacity < 0 or opacity > 100:
        raise HTTPException(status_code=400, detail="Opacity must be between 0 and 100")
    if font_size < 8 or font_size > 200:
        raise HTTPException(status_code=400, detail="Font size must be between 8 and 200")

    valid_positions = WATERMARK_POSITIONS
    if position not in valid_positions:
        raise HTTPException(status_code=400, detail="Invalid position")

    contents = await file.read()
    try:
        img = _read_image(contents).convert("RGBA")
        r, g, b = _parse_hex_color(color)
        alpha = int(255 * (opacity / 100))

        overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
        font = _get_font(font_size)
        _apply_watermark_text(overlay, img, text, font, (r, g, b, alpha), position)
        watermarked = Image.alpha_composite(img, overlay)

        if watermarked.mode == "RGBA" and (file.filename or "").lower().endswith((".jpg", ".jpeg")):
            watermarked = watermarked.convert("RGB")

        return _save_image(watermarked, file.filename or "image", "watermarked")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


ROTATE_FLIP_ACTIONS = {
    "rotate-90": Image.Transpose.ROTATE_270,
    "rotate-180": Image.Transpose.ROTATE_180,
    "rotate-270": Image.Transpose.ROTATE_90,
    "flip-horizontal": Image.Transpose.FLIP_LEFT_RIGHT,
    "flip-vertical": Image.Transpose.FLIP_TOP_BOTTOM,
}


@router.post("/rotate-flip")
async def rotate_flip_image(
    file: UploadFile = File(...),
    action: str = Form(...),
):
    if action not in ROTATE_FLIP_ACTIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid action. Use rotate-90, rotate-180, rotate-270, flip-horizontal, or flip-vertical",
        )

    contents = await file.read()
    try:
        img = _read_image(contents)
        transformed = img.transpose(ROTATE_FLIP_ACTIONS[action])
        return _save_image(transformed, file.filename or "image", action.replace("-", "_"))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/redact")
async def redact_region(
    file: UploadFile = File(...),
    regions: str = Form(""),
    left: int = Form(0),
    top: int = Form(0),
    width: int = Form(0),
    height: int = Form(0),
    mode: str = Form("blur"),
    blur_radius: int = Form(20),
):
    if mode not in {"blur", "solid"}:
        raise HTTPException(status_code=400, detail="Mode must be blur or solid")

    contents = await file.read()
    try:
        img = _read_image(contents).convert("RGB")
        region_list: list[dict] = []

        if regions.strip():
            try:
                parsed = json.loads(regions)
                if not isinstance(parsed, list) or not parsed:
                    raise HTTPException(status_code=400, detail="Regions must be a non-empty JSON array")
                region_list = parsed
            except json.JSONDecodeError as exc:
                raise HTTPException(status_code=400, detail="Invalid regions JSON") from exc
        elif width >= 1 and height >= 1:
            region_list = [{"left": left, "top": top, "width": width, "height": height}]
        else:
            raise HTTPException(status_code=400, detail="Paint at least one region on the image")

        for region in region_list:
            _redact_rect(
                img,
                int(region.get("left", 0)),
                int(region.get("top", 0)),
                int(region.get("width", 0)),
                int(region.get("height", 0)),
                mode,
                blur_radius,
            )

        return _save_image(img, file.filename or "image", "redacted")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-colors")
async def extract_colors(
    file: UploadFile = File(...),
    count: int = Form(8),
):
    count = max(2, min(count, 16))
    contents = await file.read()
    try:
        img = _read_image(contents).convert("RGB")
        small = img.resize((200, 200))
        quantized = small.quantize(colors=count)
        palette = quantized.getpalette() or []
        histogram = quantized.histogram()

        colors: list[dict] = []
        for i, freq in enumerate(histogram):
            if freq <= 0:
                continue
            r, g, b = palette[i * 3], palette[i * 3 + 1], palette[i * 3 + 2]
            colors.append({"hex": f"#{r:02x}{g:02x}{b:02x}", "rgb": [r, g, b], "weight": freq})

        colors.sort(key=lambda c: c["weight"], reverse=True)
        return JSONResponse({"colors": colors[:count]})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
