
from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    tenant_id: int


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    tenant_id: int

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str
