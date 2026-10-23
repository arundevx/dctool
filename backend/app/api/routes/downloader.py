from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
import os
import re
import shutil
import uuid

try:
    import yt_dlp
except ImportError:
    yt_dlp = None

router = APIRouter(prefix="/downloader", tags=["downloader"])

COMMON_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Sec-Fetch-Mode": "navigate",
}

QUALITY_PRESETS = [
    {"format_id": "best", "label": "Best available", "kind": "video", "height": None, "ext": "mp4"},
    {"format_id": "1080", "label": "1080p Full HD", "kind": "video", "height": 1080, "ext": "mp4"},
    {"format_id": "720", "label": "720p HD", "kind": "video", "height": 720, "ext": "mp4"},
    {"format_id": "480", "label": "480p", "kind": "video", "height": 480, "ext": "mp4"},
    {"format_id": "360", "label": "360p", "kind": "video", "height": 360, "ext": "mp4"},
    {"format_id": "audio-m4a", "label": "Audio (M4A)", "kind": "audio", "height": None, "ext": "m4a"},
    {"format_id": "audio-mp3", "label": "Audio (MP3 192kbps)", "kind": "audio", "height": None, "ext": "mp3"},
]


class InfoRequest(BaseModel):
    url: HttpUrl


class DownloadRequest(BaseModel):
    url: HttpUrl
    format_id: str


def remove_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def _base_opts(**extra):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "geo_bypass": True,
        "noplaylist": True,
        "extractor_retries": 3,
        "fragment_retries": 5,
        "retries": 5,
        "http_headers": COMMON_HEADERS,
        "socket_timeout": 30,
    }
    opts.update(extra)
    return opts


def _format_bytes(num):
    if not num or num <= 0:
        return None
    for unit in ("B", "KB", "MB", "GB"):
        if num < 1024:
            return f"{num:.1f} {unit}" if unit != "B" else f"{int(num)} {unit}"
        num /= 1024
    return f"{num:.1f} TB"


def _safe_filename(name: str) -> str:
    cleaned = re.sub(r"[^\w\s.\-()]", "", name, flags=re.UNICODE).strip()
    return cleaned[:180] or "download"


def _resolve_format(format_id: str):
    """Map UI format ids to yt-dlp format selectors + postprocessors."""
    postprocessors = []
    merge_output_format = "mp4"

    if format_id == "best":
        fmt = "bv*+ba/b"
    elif format_id in {"2160", "1440", "1080", "720", "480", "360", "240"}:
        h = int(format_id)
        fmt = f"bv*[height<={h}]+ba/b[height<={h}]/bv*+ba/b"
    elif format_id == "audio-m4a":
        fmt = "ba[ext=m4a]/ba/bestaudio"
        merge_output_format = None
    elif format_id == "audio-mp3":
        fmt = "ba/bestaudio"
        merge_output_format = None
        postprocessors = [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ]
    else:
        # Raw yt-dlp format id (may be video-only — try merge with best audio)
        fmt = f"{format_id}+bestaudio/{format_id}"

    return fmt, postprocessors, merge_output_format


def _available_heights(formats):
    heights = set()
    for f in formats or []:
        h = f.get("height")
        if h and f.get("vcodec") not in (None, "none"):
            heights.add(int(h))
    return heights


@router.post("/info")
async def get_video_info(req: InfoRequest):
    if not yt_dlp:
        raise HTTPException(status_code=501, detail="yt-dlp is not installed on this server.")

    ydl_opts = _base_opts(skip_download=True)

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=False)

            if info is None:
                raise HTTPException(status_code=400, detail="Could not extract media information.")

            # Playlist / multi-entry: take first entry
            if info.get("_type") == "playlist" and info.get("entries"):
                entry = next((e for e in info["entries"] if e), None)
                if entry:
                    info = entry

            raw_formats = info.get("formats") or []
            heights = _available_heights(raw_formats)
            max_height = max(heights) if heights else None

            curated = []
            for preset in QUALITY_PRESETS:
                if preset["kind"] == "video" and preset["height"]:
                    if max_height and preset["height"] > max_height + 20:
                        continue
                    if heights and not any(h >= preset["height"] * 0.9 for h in heights) and preset["height"] > (max_height or 0):
                        continue

                curated.append(
                    {
                        "format_id": preset["format_id"],
                        "ext": preset["ext"],
                        "resolution": f"{preset['height']}p" if preset["height"] else ("Best" if preset["kind"] == "video" else "Audio"),
                        "label": preset["label"],
                        "kind": preset["kind"],
                        "filesize": 0,
                        "filesize_label": None,
                        "recommended": preset["format_id"] in {"best", "audio-mp3"},
                    }
                )

            # Extra high-bitrate audio options from source when useful
            audio_candidates = [
                f
                for f in raw_formats
                if f.get("acodec") not in (None, "none") and f.get("vcodec") in (None, "none")
            ]
            audio_candidates.sort(key=lambda f: f.get("abr") or f.get("tbr") or 0, reverse=True)
            seen_audio = set()
            for f in audio_candidates[:3]:
                fid = f.get("format_id")
                if not fid or fid in seen_audio:
                    continue
                seen_audio.add(fid)
                abr = f.get("abr") or f.get("tbr")
                filesize = f.get("filesize") or f.get("filesize_approx") or 0
                curated.append(
                    {
                        "format_id": str(fid),
                        "ext": f.get("ext") or "m4a",
                        "resolution": "Audio",
                        "label": f"Source audio · {(f.get('ext') or 'audio').upper()}"
                        + (f" · {int(abr)} kbps" if abr else ""),
                        "kind": "audio",
                        "filesize": filesize,
                        "filesize_label": _format_bytes(filesize),
                        "recommended": False,
                    }
                )

            duration = info.get("duration") or 0
            try:
                duration = int(duration)
            except (TypeError, ValueError):
                duration = 0

            return {
                "title": info.get("title") or "Untitled",
                "thumbnail": info.get("thumbnail") or (info.get("thumbnails") or [{}])[-1].get("url", ""),
                "duration": duration,
                "uploader": info.get("uploader") or info.get("channel") or info.get("creator") or "",
                "extractor": info.get("extractor_key") or info.get("extractor") or "",
                "webpage_url": info.get("webpage_url") or str(req.url),
                "view_count": info.get("view_count"),
                "has_ffmpeg": bool(shutil.which("ffmpeg")),
                "formats": curated,
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch video info: {str(e)}")


@router.post("/download")
async def download_video(req: DownloadRequest, background_tasks: BackgroundTasks):
    if not yt_dlp:
        raise HTTPException(status_code=501, detail="yt-dlp is not installed on this server.")

    temp_id = str(uuid.uuid4())
    temp_dir = "/tmp" if os.path.exists("/tmp") else "./temp"
    os.makedirs(temp_dir, exist_ok=True)
    outtmpl = os.path.join(temp_dir, f"{temp_id}.%(ext)s")

    fmt, postprocessors, merge_output_format = _resolve_format(req.format_id)

    ydl_opts = _base_opts(
        format=fmt,
        outtmpl=outtmpl,
        postprocessors=postprocessors,
    )
    if merge_output_format and shutil.which("ffmpeg"):
        ydl_opts["merge_output_format"] = merge_output_format

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=True)

            if info is None:
                raise Exception("Download produced no metadata.")

            if info.get("_type") == "playlist" and info.get("entries"):
                info = next((e for e in info["entries"] if e), info)

            ext = info.get("ext", "mp4")
            if req.format_id == "audio-mp3":
                ext = "mp3"
            elif req.format_id == "audio-m4a":
                ext = "m4a"

            actual_file_path = os.path.join(temp_dir, f"{temp_id}.{ext}")

            if not os.path.exists(actual_file_path):
                matches = [
                    os.path.join(temp_dir, f)
                    for f in os.listdir(temp_dir)
                    if f.startswith(temp_id)
                ]
                if not matches:
                    raise Exception("Downloaded file not found.")
                # Prefer non-part files; pick largest as final
                matches.sort(key=lambda p: os.path.getsize(p), reverse=True)
                actual_file_path = matches[0]
                ext = actual_file_path.rsplit(".", 1)[-1]

            filename = _safe_filename(f"{info.get('title', 'video')}.{ext}")
            background_tasks.add_task(remove_file, actual_file_path)

            return FileResponse(
                path=actual_file_path,
                filename=filename,
                media_type="application/octet-stream",
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download video: {str(e)}")
