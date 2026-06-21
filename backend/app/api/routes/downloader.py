from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
import os
import uuid

try:
    import yt_dlp
except ImportError:
    yt_dlp = None

router = APIRouter(prefix="/downloader", tags=["downloader"])

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

@router.post("/info")
async def get_video_info(req: InfoRequest):
    if not yt_dlp:
        raise HTTPException(status_code=501, detail="yt-dlp is not installed on this server.")

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
        'allow_unplayable_formats': True,
        'geo_bypass': True,
        'noplaylist': True,
        'extractor_retries': 3,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Sec-Fetch-Mode': 'navigate',
        }
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=False)
            
            # Filter and simplify formats for the frontend
            formats = []
            if 'formats' in info:
                for f in info['formats']:
                    # Only include formats with video or audio
                    if f.get('vcodec') != 'none' or f.get('acodec') != 'none':
                        format_note = f.get('format_note', '')
                        resolution = f.get('resolution', '')
                        ext = f.get('ext', '')
                        filesize = f.get('filesize') or f.get('filesize_approx') or 0
                        
                        # Create a human readable label
                        if f.get('vcodec') != 'none' and f.get('acodec') != 'none':
                            type_str = "Video + Audio"
                        elif f.get('vcodec') != 'none':
                            type_str = "Video Only"
                        else:
                            type_str = "Audio Only"
                            
                        if resolution:
                            label = f"{resolution} - {ext.upper()} ({type_str})"
                        else:
                            label = f"{format_note or 'Unknown'} - {ext.upper()} ({type_str})"
                            
                        # If filesize is available, add it
                        if filesize > 0:
                            mb = filesize / (1024 * 1024)
                            label += f" - {mb:.1f} MB"
                            
                        formats.append({
                            "format_id": f.get('format_id'),
                            "ext": ext,
                            "resolution": resolution,
                            "label": label,
                            "filesize": filesize
                        })
            
            return {
                "title": info.get('title', 'Unknown Video'),
                "thumbnail": info.get('thumbnail', ''),
                "duration": info.get('duration', 0),
                "formats": formats
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch video info: {str(e)}")

@router.post("/download")
async def download_video(req: DownloadRequest, background_tasks: BackgroundTasks):
    if not yt_dlp:
        raise HTTPException(status_code=501, detail="yt-dlp is not installed on this server.")

    temp_id = str(uuid.uuid4())
    temp_dir = "/tmp"
    if not os.path.exists(temp_dir):
        # Fallback to local directory if /tmp doesn't exist (e.g. Windows)
        temp_dir = "./temp"
        os.makedirs(temp_dir, exist_ok=True)
        
    outtmpl = os.path.join(temp_dir, f"{temp_id}.%(ext)s")
    
    ydl_opts = {
        'format': req.format_id,
        'outtmpl': outtmpl,
        'quiet': True,
        'no_warnings': True,
        'allow_unplayable_formats': True,
        'geo_bypass': True,
        'noplaylist': True,
        'extractor_retries': 3,
        'fragment_retries': 3,
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Sec-Fetch-Mode': 'navigate',
        }
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=True)
            
            # Find the actual downloaded file path
            ext = info.get('ext', 'mp4')
            actual_file_path = os.path.join(temp_dir, f"{temp_id}.{ext}")
            
            if not os.path.exists(actual_file_path):
                # Sometimes yt-dlp merges into a different container (mkv, webm, mp4)
                # Let's search the temp dir for the prefix
                for file in os.listdir(temp_dir):
                    if file.startswith(temp_id):
                        actual_file_path = os.path.join(temp_dir, file)
                        ext = file.split('.')[-1]
                        break
            
            if not os.path.exists(actual_file_path):
                 raise Exception("Downloaded file not found.")

            filename = f"{info.get('title', 'video')}.{ext}"
            # Clean up the filename to be safe for HTTP headers
            safe_filename = "".join([c for c in filename if c.isalpha() or c.isdigit() or c in (' ', '.', '-', '_')]).rstrip()
            
            background_tasks.add_task(remove_file, actual_file_path)
            
            return FileResponse(
                path=actual_file_path, 
                filename=safe_filename, 
                media_type="application/octet-stream"
            )
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download video: {str(e)}")
