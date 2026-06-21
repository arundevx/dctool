from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import images, pdfs, downloader

app = FastAPI(
    title="DreamConsole API",
    description="Backend API for DreamConsole online tools platform",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://dreamconsole.org"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images.router, prefix="/api")
app.include_router(pdfs.router, prefix="/api")
app.include_router(downloader.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the DreamConsole API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
