
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.scan import Scan
from app.models.asset import Asset
from app.models.user import User
from app.schemas.scan import ScanCreate, ScanResponse
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/scans", tags=["Scans"])


# -------------------------------
# DATABASE CONNECTION
# -------------------------------

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# -------------------------------
# ALLOWED SCAN TYPES
# -------------------------------

ALLOWED_SCAN_TYPES = {
    "asset_inventory",
    "tls_configuration",
    "http_security_headers"
}


# -------------------------------
# CREATE SCAN REQUEST
# -------------------------------

@router.post("/", response_model=ScanResponse)
def create_scan(
    data: ScanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Validate scan type
    if data.scan_type not in ALLOWED_SCAN_TYPES:
        raise HTTPException(
            status_code=422,
            detail="Unsupported scan type"
        )

    # Find asset belonging to the logged-in tenant
    asset = db.query(Asset).filter(
        Asset.id == data.asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    # Require verified ownership
    if asset.verified_at is None:
        raise HTTPException(
            status_code=403,
            detail="Asset ownership must be verified before requesting a scan"
        )

    # Only support domain and web application assets for now
    if asset.asset_type not in ("domain", "web_application"):
        raise HTTPException(
            status_code=400,
            detail="This asset type is not supported for scanning yet"
        )

    # Create a pending scan record
    new_scan = Scan(
        asset_id=asset.id,
        tenant_id=current_user.tenant_id,
        scan_type=data.scan_type,
        status="pending",
        scope_description=(
            "Single registered asset only: "
            + asset.value
            + ". No subdomain expansion or out-of-scope targets."
        )
    )

    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    return new_scan


# -------------------------------
# LIST COMPANY SCANS
# -------------------------------

@router.get("/", response_model=list[ScanResponse])
def get_scans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    scans = db.query(Scan).filter(
        Scan.tenant_id == current_user.tenant_id
    ).order_by(
        Scan.requested_at.desc()
    ).all()

    return scans


# -------------------------------
# GET SINGLE SCAN
# -------------------------------

@router.get("/{scan_id}", response_model=ScanResponse)
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.tenant_id == current_user.tenant_id
    ).first()

    if not scan:
        raise HTTPException(
            status_code=404,
            detail="Scan not found"
        )

    return scan
