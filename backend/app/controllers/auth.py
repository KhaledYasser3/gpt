from fastapi import HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
import uuid

from app.controllers.admin import user_json
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.schemas.user import LoginRequest
from app.services import admin_user_service

def service_error_to_http(error: admin_user_service.ServiceError) -> HTTPException:
    return HTTPException(status_code=error.status_code, detail=error.message)

async def login(payload: LoginRequest, response: Response, db: AsyncSession):
    try:
        user, subscription = await admin_user_service.login_user(
            db,
            email=str(payload.email),
            password=payload.password,
        )
    except admin_user_service.ServiceError as exc:
        raise service_error_to_http(exc) from exc

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
    )

    return {
        "message": "Login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_json(user, subscription),
    }

async def refresh_token(token: str, response: Response, db: AsyncSession):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if user_id is None or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    try:
        user = await admin_user_service.get_user_by_id(db, uuid.UUID(user_id))
        if not user.is_active:
            raise HTTPException(status_code=401, detail="User account is inactive.")
    except admin_user_service.NotFoundError:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
