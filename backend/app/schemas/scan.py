

from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ScanCreate(BaseModel):
    asset_id: int
    scan_type: str
    scope_description: str | None = None


class ScanResponse(BaseModel):
    id: int
    asset_id: int
    tenant_id: int
    scan_type: str
    status: str
    scope_description: str | None
    requested_at: datetime
    started_at: datetime | None
    completed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
