
from fastapi import FastAPI
from app.api.asset import router as asset_router
from app.api.scan import router as scan_router

from app.api.tenant import router as tenant_router
from app.api.user import router as user_router

app = FastAPI(
    title="SentinelGrid API",
    description="AI-Assisted Cybersecurity Posture Monitoring Platform",
    version="0.1.0"
)

app.include_router(tenant_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(scan_router, prefix="/api/v1")
app.include_router(asset_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "project": "SentinelGrid"
    }
