
import ipaddress
import validators
from urllib.parse import urlparse
import secrets
from urllib.parse import urlparse
import dns.resolver
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetResponse, AssetUpdate
from app.models.user import User
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/assets", tags=["Assets"])


# -------------------------------
# ASSET VALIDATION
# -------------------------------

def validate_asset(asset_type: str, value: str):

    value = value.strip()

    if not value:
        raise HTTPException(
            status_code=422,
            detail="Asset value cannot be empty"
        )

    if asset_type == "domain":

        if not validators.domain(value):
            raise HTTPException(
                status_code=422,
                detail="Invalid domain name"
            )

    elif asset_type == "ip_address":

        try:
            ipaddress.ip_address(value)

        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid IP address"
            )

    elif asset_type == "web_application":

        if not validators.url(value):
            raise HTTPException(
                status_code=422,
                detail="Invalid web application URL"
            )

        parsed_url = urlparse(value)

        if parsed_url.scheme not in ("http", "https"):
            raise HTTPException(
                status_code=422,
                detail="Only HTTP and HTTPS URLs are allowed"
            )

    else:
        raise HTTPException(
            status_code=422,
            detail="Unsupported asset type"
        )


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
# REGISTER ASSET
# -------------------------------

@router.post("/", response_model=AssetResponse)
def create_asset(
    data: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    validate_asset(data.asset_type, data.value)

    value = data.value.strip()

    existing_asset = db.query(Asset).filter(
        Asset.tenant_id == current_user.tenant_id,
        Asset.asset_type == data.asset_type,
        Asset.value == value
    ).first()

    if existing_asset:

        raise HTTPException(
            status_code=409,
            detail="This asset is already registered"
        )

    new_asset = Asset(
        name=data.name,
        asset_type=data.asset_type,
        value=value,
        description=data.description,
        tenant_id=current_user.tenant_id
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    return new_asset


# -------------------------------
# LIST ALL COMPANY ASSETS
# -------------------------------

@router.get("/", response_model=list[AssetResponse])
def get_assets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    assets = db.query(Asset).filter(
        Asset.tenant_id == current_user.tenant_id
    ).all()

    return assets


# -------------------------------
# GET SINGLE ASSET
# -------------------------------

@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:

        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    return asset



# -------------------------------
# UPDATE ASSET
# -------------------------------

@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    data: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    update_data = data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="No update data provided"
        )

    # Prevent null values for required fields
    for field in ("name", "asset_type", "value"):
        if field in update_data and update_data[field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null"
            )

    updated_type = update_data.get(
        "asset_type",
        asset.asset_type
    )

    updated_value = update_data.get(
        "value",
        asset.value
    )

    updated_value = updated_value.strip()

    validate_asset(updated_type, updated_value)

    # Check for duplicate assets
    duplicate_asset = db.query(Asset).filter(
        Asset.tenant_id == current_user.tenant_id,
        Asset.asset_type == updated_type,
        Asset.value == updated_value,
        Asset.id != asset_id
    ).first()

    if duplicate_asset:
        raise HTTPException(
            status_code=409,
            detail="Another asset with this type and value already exists"
        )

    # Check whether the asset identity has changed
    identity_changed = (
        updated_type != asset.asset_type
        or updated_value != asset.value
    )

    # Update asset fields
    for key, value in update_data.items():

        if key == "value":
            value = updated_value

        setattr(asset, key, value)

    # Invalidate old ownership verification
    if identity_changed:
        asset.verification_token = None
        asset.verified_at = None

    db.commit()
    db.refresh(asset)

    return asset

# -------------------------------
# DELETE ASSET
# -------------------------------

@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:

        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    db.delete(asset)
    db.commit()

    return {
        "message": "Asset deleted successfully"
    }

# -------------------------------
# GENERATE DNS VERIFICATION TOKEN
# -------------------------------

@router.post("/{asset_id}/verification-token")
def generate_verification_token(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    if asset.asset_type not in ("domain", "web_application"):
        raise HTTPException(
            status_code=400,
            detail="DNS verification is supported only for domains and web applications"
        )

    if asset.asset_type == "domain":
        domain = asset.value
    else:
        domain = urlparse(asset.value).hostname

    if not domain:
        raise HTTPException(
            status_code=422,
            detail="Unable to determine domain name"
        )

    token = "sentinelgrid-verification=" + secrets.token_urlsafe(32)

    asset.verification_token = token
    asset.verified_at = None

    db.commit()
    db.refresh(asset)

    return {
        "message": "Verification token generated successfully",
        "asset_id": asset.id,
        "domain": domain,
        "record_type": "TXT",
        "record_name": "_sentinelgrid-verification." + domain,
        "record_value": token
    }

# -------------------------------
# VERIFY DOMAIN OWNERSHIP THROUGH DNS
# -------------------------------

@router.post("/{asset_id}/verify-ownership")
def verify_asset_ownership(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    if asset.asset_type not in ("domain", "web_application"):
        raise HTTPException(
            status_code=400,
            detail="DNS verification is supported only for domains and web applications"
        )

    if not asset.verification_token:
        raise HTTPException(
            status_code=400,
            detail="Generate a verification token first"
        )

    if asset.asset_type == "domain":
        domain = asset.value
    else:
        domain = urlparse(asset.value).hostname

    if not domain:
        raise HTTPException(
            status_code=422,
            detail="Unable to determine domain name"
        )

    record_name = "_sentinelgrid-verification." + domain

    try:
        answers = dns.resolver.resolve(record_name, "TXT")

        found = False

        for answer in answers:
            txt_value = "".join(
                part.decode("utf-8") if isinstance(part, bytes) else part
                for part in answer.strings
            )

            if txt_value == asset.verification_token:
                found = True
                break

        if not found:
            raise HTTPException(
                status_code=400,
                detail="Verification TXT record not found or token does not match"
            )

        asset.verified_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(asset)

        return {
            "message": "Asset ownership verified successfully",
            "asset_id": asset.id,
            "domain": domain,
            "verified": True,
            "verified_at": asset.verified_at
        }

    except dns.resolver.NXDOMAIN:
        raise HTTPException(
            status_code=400,
            detail="DNS verification record does not exist"
        )

    except dns.resolver.NoAnswer:
        raise HTTPException(
            status_code=400,
            detail="No TXT record found for the verification name"
        )

    except dns.resolver.Timeout:
        raise HTTPException(
            status_code=504,
            detail="DNS lookup timed out. Please try again"
        )

    except dns.resolver.NoNameservers:
        raise HTTPException(
            status_code=503,
            detail="DNS nameservers are unavailable"
        )
    
# -------------------------------
# CHECK ASSET VERIFICATION STATUS
# -------------------------------

@router.get("/{asset_id}/verification-status")
def get_verification_status(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    asset = db.query(Asset).filter(
        Asset.id == asset_id,
        Asset.tenant_id == current_user.tenant_id
    ).first()

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    is_verified = asset.verified_at is not None

    return {
        "asset_id": asset.id,
        "asset_name": asset.name,
        "asset_value": asset.value,
        "verified": is_verified,
        "verified_at": asset.verified_at,
        "scan_eligible": is_verified
    }



