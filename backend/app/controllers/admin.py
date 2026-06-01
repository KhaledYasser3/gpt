import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import AdminUserAction
from app.schemas.user import AdminAddTokens, AdminRenewSubscription, AdminUserCreate
from app.services import admin_user_service


def normalize_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def subscription_json(subscription) -> dict:
    return {
        "id": subscription.id,
        "token_limit": subscription.token_limit,
        "tokens_used": subscription.tokens_used,
        "usage_percentage": float(subscription.usage_percentage),
        "start_date": subscription.start_date,
        "end_date": subscription.end_date,
        "status": subscription.status,
    }


def user_json(user, subscription=None) -> dict:
    payload = {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "subscription": None,
    }
    if subscription is not None:
        payload["subscription"] = subscription_json(subscription)
    return payload


def service_error_to_http(error: admin_user_service.ServiceError) -> HTTPException:
    return HTTPException(status_code=error.status_code, detail=error.message)


async def create_user(payload: AdminUserCreate, db: AsyncSession):
    start_date = normalize_datetime(payload.start_date)
    end_date = normalize_datetime(payload.end_date)
    if end_date <= start_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_date must be after start_date.",
        )

    try:
        user, subscription = await admin_user_service.create_user_account(
            db,
            email=str(payload.email),
            username=payload.username,
            full_name=payload.full_name,
            password=payload.password,
            token_limit=payload.token_limit,
            start_date=start_date,
            end_date=end_date,
        )
    except admin_user_service.ServiceError as exc:
        raise service_error_to_http(exc) from exc

    return {
        "action": AdminUserAction.CREATE,
        "message": "User account created successfully.",
        "user": user_json(user, subscription),
    }


async def delete_user(user_id: uuid.UUID, db: AsyncSession):
    try:
        user = await admin_user_service.delete_user_account(db, user_id)
    except admin_user_service.ServiceError as exc:
        raise service_error_to_http(exc) from exc

    return {
        "action": AdminUserAction.DELETE,
        "message": "User account deleted successfully.",
        "user": user_json(user),
    }


async def renew_user_subscription(
    user_id: uuid.UUID,
    payload: AdminRenewSubscription,
    db: AsyncSession,
):
    end_date = normalize_datetime(payload.end_date)
    if end_date <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_date must be in the future.",
        )

    try:
        user, subscription = await admin_user_service.renew_user_subscription(
            db,
            user_id=user_id,
            end_date=end_date,
        )
    except admin_user_service.ServiceError as exc:
        raise service_error_to_http(exc) from exc

    return {
        "action": AdminUserAction.RENEW,
        "message": "Subscription renewed successfully.",
        "user": user_json(user, subscription),
    }


async def add_user_tokens(
    user_id: uuid.UUID,
    payload: AdminAddTokens,
    db: AsyncSession,
):
    try:
        user, subscription = await admin_user_service.add_user_tokens(
            db,
            user_id=user_id,
            tokens=payload.tokens,
        )
    except admin_user_service.ServiceError as exc:
        raise service_error_to_http(exc) from exc

    return {
        "action": AdminUserAction.ADD_TOKENS,
        "message": "Tokens added successfully.",
        "user": user_json(user, subscription),
    }
