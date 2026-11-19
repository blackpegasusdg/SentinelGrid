
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func

from app.database.connection import Base


class Asset(Base):

    __tablename__ = "assets"

    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "asset_type",
            "value",
            name="uq_tenant_asset"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    asset_type = Column(String(30), nullable=False)

    value = Column(String(500), nullable=False)

    description = Column(Text, nullable=True)

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    verification_token = Column(String(100), nullable=True)

    verified_at = Column(DateTime(timezone=True), nullable=True)