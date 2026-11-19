
from app.database.connection import Base, engine

from app.models.tenant import Tenant
from app.models.user import User
from app.models.asset import Asset
from app.models.scan import Scan


Base.metadata.create_all(bind=engine)

print("SentinelGrid database tables created successfully!")
