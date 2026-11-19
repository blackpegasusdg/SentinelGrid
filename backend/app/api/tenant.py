
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantResponse

router = APIRouter(prefix="/tenants", tags=["Tenants"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TenantResponse)
def create_tenant(data: TenantCreate, db: Session = Depends(get_db)):

    tenant = Tenant(name=data.name)

    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    return tenant


@router.get("/", response_model=list[TenantResponse])
def get_tenants(db: Session = Depends(get_db)):
    return db.query(Tenant).all()
