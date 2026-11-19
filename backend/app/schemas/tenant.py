
from pydantic import BaseModel, ConfigDict


class TenantCreate(BaseModel):
    name: str


class TenantResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
