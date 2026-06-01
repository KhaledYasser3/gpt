import uuid
from datetime import datetime, timezone
from typing import Optional

import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import SubscriptionStatus, UserRole
from app.models.subscription import Subscription
from app.models.user import User




class ServiceError(Exception):
    status_code = 400

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class NotFoundError(ServiceError):
    status_code = 404


class ConflictError(ServiceError):
    status_code = 409


class UnauthorizedError(ServiceError):
    status_code = 401


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    pwd_bytes = password.encode("utf-8")[:72]
    hash_bytes = password_hash.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hash_bytes)


def calculate_usage_percentage(tokens_used: int, token_limit: int) -> float:
    if token_limit <= 0:
        return 0.0
    return round((tokens_used / token_limit) * 100, 2)


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID) -> User:
    user = await db.get(User, user_id)
    if user is None:
        raise NotFoundError("User not found.")
    return user


async def get_latest_subscription(db: AsyncSession, user_id: uuid.UUID) -> Optional[Subscription]:
    result = await db.execute(
        select(Subscription)
        .where(Subscription.user_id == user_id)
        .order_by(Subscription.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


async def create_user_account(
    db: AsyncSession,
    *,
    email: str,
    username: str,
    full_name: str,
    password: str,
    token_limit: int,
    start_date: datetime,
    end_date: datetime,
) -> tuple[User, Subscription]:
    existing_email = await db.execute(select(User).where(User.email == email))
    if existing_email.scalar_one_or_none() is not None:
        raise ConflictError("Email already exists.")

    existing_username = await db.execute(select(User).where(User.username == username))
    if existing_username.scalar_one_or_none() is not None:
        raise ConflictError("Username already exists.")

    user = User(
        email=email,
        username=username,
        full_name=full_name,
        password_hash=hash_password(password),
        role=UserRole.USER,
        is_active=True,
    )
    db.add(user)
    await db.flush()

    subscription = Subscription(
        user_id=user.id,
        token_limit=token_limit,
        tokens_used=0,
        usage_percentage=0.0,
        start_date=start_date,
        end_date=end_date,
        status=SubscriptionStatus.ACTIVE,
    )
    db.add(subscription)
    await db.flush()
    await db.refresh(user)
    await db.refresh(subscription)
    return user, subscription


async def delete_user_account(db: AsyncSession, user_id: uuid.UUID) -> User:
    user = await get_user_by_id(db, user_id)
    await db.delete(user)
    return user


async def renew_user_subscription(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    end_date: datetime,
) -> tuple[User, Subscription]:
    user = await get_user_by_id(db, user_id)
    subscription = await get_latest_subscription(db, user_id)
    if subscription is None:
        raise NotFoundError("Subscription not found.")

    subscription.end_date = end_date
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(subscription)
    return user, subscription


async def add_user_tokens(
    db: AsyncSession,
    *,
    user_id: uuid.UUID,
    tokens: int,
) -> tuple[User, Subscription]:
    user = await get_user_by_id(db, user_id)
    subscription = await get_latest_subscription(db, user_id)
    if subscription is None:
        raise NotFoundError("Subscription not found.")

    subscription.token_limit += tokens
    subscription.usage_percentage = calculate_usage_percentage(
        subscription.tokens_used,
        subscription.token_limit,
    )
    subscription.updated_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(subscription)
    return user, subscription


async def login_user(db: AsyncSession, *, email: str, password: str) -> tuple[User, Optional[Subscription]]:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(password, user.password_hash):
        raise UnauthorizedError("Invalid email or password.")
    if not user.is_active:
        raise UnauthorizedError("User account is inactive.")
    return user, await get_latest_subscription(db, user.id)
