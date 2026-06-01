from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import auth as auth_controller
from app.core.database import get_db
from app.schemas.user import LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    return await auth_controller.login(payload, response, db)

@router.post("/refresh")
async def refresh_token(
    response: Response, 
    refresh_token: str | None = Cookie(default=None), 
    db: AsyncSession = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing",
        )
    return await auth_controller.refresh_token(refresh_token, response, db)
