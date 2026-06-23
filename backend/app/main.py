from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import images, pdfs, downloader, seo, developer, auth, users, usage, admin
from app.api.deps import check_usage_limit

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

app.include_router(images.router, prefix="/api", dependencies=[Depends(check_usage_limit)])
app.include_router(pdfs.router, prefix="/api", dependencies=[Depends(check_usage_limit)])
app.include_router(downloader.router, prefix="/api", dependencies=[Depends(check_usage_limit)])
app.include_router(seo.router, prefix="/api", dependencies=[Depends(check_usage_limit)])
app.include_router(developer.router, prefix="/api", dependencies=[Depends(check_usage_limit)])
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(usage.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the DreamConsole API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
