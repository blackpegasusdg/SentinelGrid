
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User
from app.core.security import verify_access_token


security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        user_id = int(payload.get("sub"))
        tenant_id = int(payload.get("tenant_id"))
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=401,
         detail="Invalid authentication token",
         headers={"WWW-Authenticate": "Bearer"}
    )
    

    if user_id is None or tenant_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = db.query(User).filter(
        User.id == user_id,
        User.tenant_id == tenant_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found or token is no longer valid",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user
