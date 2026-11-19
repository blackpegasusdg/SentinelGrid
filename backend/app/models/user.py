
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
