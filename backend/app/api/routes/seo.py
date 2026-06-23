import re
from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse, Response
import requests

router = APIRouter(prefix="/seo", tags=["seo"])

MAX_HTML_BYTES = 512 * 1024
USER_AGENT = "DreamConsoleBot/1.0 (+https://dreamconsole.org)"


def _meta_content(html: str, *, prop: str | None = None, name: str | None = None) -> str | None:
    if prop:
        pattern = rf'<meta[^>]+property=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']+)["\']'
        alt = rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']{re.escape(prop)}["\']'
    else:
        pattern = rf'<meta[^>]+name=["\']{re.escape(name or "")}["\'][^>]+content=["\']([^"\']+)["\']'
        alt = rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']{re.escape(name or "")}["\']'

    for p in (pattern, alt):
        match = re.search(p, html, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _extract_colors(html: str) -> list[str]:
    found = re.findall(r"#(?:[0-9a-fA-F]{3}){1,2}\b", html)
    theme = _meta_content(html, name="theme-color")
    if theme and theme.startswith("#"):
        found.insert(0, theme)
    counts: dict[str, int] = {}
    for color in found:
        c = color.lower()
        if len(c) == 4:
            c = "#" + "".join(ch * 2 for ch in c[1:])
        counts[c] = counts.get(c, 0) + 1
    return [c for c, _ in sorted(counts.items(), key=lambda x: -x[1])][:12]


@router.post("/fetch-page")
async def fetch_page(url: str = Form(...)):
    target = url.strip()
    if not target:
        raise HTTPException(status_code=400, detail="URL is required")
    if not re.match(r"^https?://", target, re.IGNORECASE):
        target = f"https://{target}"

    try:
        response = requests.get(
            target,
            timeout=15,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=True,
        )
        response.raise_for_status()
        html = response.text[:MAX_HTML_BYTES]

        title_match = re.search(r"<title[^>]*>([^<]+)</title>", html, re.IGNORECASE)
        title = (title_match.group(1).strip() if title_match else None) or _meta_content(html, name="title")

        return JSONResponse(
            {
                "url": response.url,
                "title": title or "",
                "description": _meta_content(html, name="description") or _meta_content(html, prop="og:description") or "",
                "image": _meta_content(html, prop="og:image") or "",
                "site_name": _meta_content(html, prop="og:site_name") or "",
                "og_title": _meta_content(html, prop="og:title") or title or "",
                "og_type": _meta_content(html, prop="og:type") or "website",
                "colors": _extract_colors(html),
            }
        )
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch URL: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/proxy-image")
async def proxy_image(image_url: str = Form(...)):
    target = image_url.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Image URL is required")
    if not re.match(r"^https?://", target, re.IGNORECASE):
        target = f"https://{target}"

    try:
        response = requests.get(
            target,
            timeout=15,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=True,
        )
        response.raise_for_status()
        content_type = response.headers.get("content-type", "image/jpeg")
        if not content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="URL did not return an image")
        return Response(content=response.content, media_type=content_type)
    except HTTPException:
        raise
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch image: {str(e)}")
