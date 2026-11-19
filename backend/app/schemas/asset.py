
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class AssetCreate(BaseModel):
    name: str
    asset_type: str
    value: str
    description: str | None = None


class AssetResponse(BaseModel):
    id: int
    name: str
    asset_type: str
    value: str
    description: str | None
    tenant_id: int
    created_at: datetime
    verified_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class AssetUpdate(BaseModel):
    name: str | None = None
    asset_type: str | None = None
    value: str | None = None
    description: str | None = None
