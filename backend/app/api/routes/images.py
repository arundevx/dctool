from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from io import BytesIO
from PIL import Image

router = APIRouter(prefix="/images", tags=["images"])

MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB

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
        img = Image.open(BytesIO(contents))
        
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
        img = Image.open(BytesIO(contents))
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
