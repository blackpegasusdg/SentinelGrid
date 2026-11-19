
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)
from sqlalchemy.sql import func

from app.database.connection import Base


class Scan(Base):

    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(
        Integer,
        ForeignKey("assets.id"),
        nullable=False,
        index=True
    )

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id"),
        nullable=False,
        index=True
    )

    scan_type = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False,
        default="pending"
    )

    scope_description = Column(
        Text,
        nullable=True
    )

    requested_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    started_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )
