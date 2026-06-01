import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import admin as admin_controller
from app.core.database import get_db
from app.schemas.user import AdminAddTokens, AdminRenewSubscription, AdminUserCreate

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_user(payload: AdminUserCreate, db: AsyncSession = Depends(get_db)):
    return await admin_controller.create_user(payload, db)


@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await admin_controller.delete_user(user_id, db)


@router.patch("/{user_id}/renew")
async def renew_user_subscription(
    user_id: uuid.UUID,
    payload: AdminRenewSubscription,
    db: AsyncSession = Depends(get_db),
):
    return await admin_controller.renew_user_subscription(user_id, payload, db)


@router.patch("/{user_id}/tokens")
async def add_user_tokens(
    user_id: uuid.UUID,
    payload: AdminAddTokens,
    db: AsyncSession = Depends(get_db),
):
    return await admin_controller.add_user_tokens(user_id, payload, db)
