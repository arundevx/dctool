from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
import hashlib
import base64
import json
import random
import string

router = APIRouter(prefix="/developer", tags=["developer"])

LOREM_IPSUM_TEXT = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris "
    "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "
    "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui "
    "officia deserunt mollit anim id est laborum."
)

@router.post("/lorem-ipsum")
async def generate_lorem_ipsum(paragraphs: int = Form(3)):
    if paragraphs < 1 or paragraphs > 50:
        raise HTTPException(status_code=400, detail="Paragraphs must be between 1 and 50")
    
    text_blocks = [LOREM_IPSUM_TEXT] * paragraphs
    return JSONResponse({"text": "\n\n".join(text_blocks)})

@router.post("/password")
async def generate_password(
    length: int = Form(16),
    use_numbers: bool = Form(True),
    use_symbols: bool = Form(True),
    use_uppercase: bool = Form(True),
    use_lowercase: bool = Form(True)
):
    if length < 4 or length > 128:
        raise HTTPException(status_code=400, detail="Length must be between 4 and 128")
    
    characters = ""
    if use_lowercase:
        characters += string.ascii_lowercase
    if use_uppercase:
        characters += string.ascii_uppercase
    if use_numbers:
        characters += string.digits
    if use_symbols:
        characters += string.punctuation

    if not characters:
        raise HTTPException(status_code=400, detail="At least one character type must be selected")

    password = "".join(random.choice(characters) for _ in range(length))
    return JSONResponse({"password": password})

@router.post("/hash")
async def generate_hash(text: str = Form(...), algorithm: str = Form("sha256")):
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    encoded_text = text.encode("utf-8")
    valid_algorithms = {"md5": hashlib.md5, "sha1": hashlib.sha1, "sha256": hashlib.sha256, "sha512": hashlib.sha512}
    
    if algorithm not in valid_algorithms:
        raise HTTPException(status_code=400, detail="Invalid algorithm. Supported: md5, sha1, sha256, sha512")
    
    hash_obj = valid_algorithms[algorithm](encoded_text)
    return JSONResponse({"hash": hash_obj.hexdigest(), "algorithm": algorithm})

@router.post("/base64")
async def process_base64(text: str = Form(...), action: str = Form("encode")):
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        if action == "encode":
            encoded_bytes = base64.b64encode(text.encode("utf-8"))
            return JSONResponse({"result": encoded_bytes.decode("utf-8")})
        elif action == "decode":
            decoded_bytes = base64.b64decode(text.encode("utf-8"))
            return JSONResponse({"result": decoded_bytes.decode("utf-8")})
        else:
            raise HTTPException(status_code=400, detail="Action must be 'encode' or 'decode'")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Base64 processing failed: {str(e)}")

@router.post("/json-format")
async def format_json(json_string: str = Form(...), minify: bool = Form(False)):
    if not json_string.strip():
        raise HTTPException(status_code=400, detail="JSON string cannot be empty")
    
    try:
        parsed = json.loads(json_string)
        if minify:
            formatted = json.dumps(parsed, separators=(',', ':'))
        else:
            formatted = json.dumps(parsed, indent=4)
        return JSONResponse({"formatted": formatted, "is_valid": True})
    except json.JSONDecodeError as e:
        return JSONResponse(status_code=400, content={"formatted": "", "is_valid": False, "error": str(e)})
