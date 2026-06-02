import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import get_db
from app.main import app
from app.core.enums import SubscriptionStatus, UserRole
from app.services import admin_user_service


# ---------------------------------------------------------------------------
# DB override – no real database needed for unit tests
# ---------------------------------------------------------------------------
async def override_db():
    yield SimpleNamespace()


app.dependency_overrides[get_db] = override_db

client = TestClient(app)


# ---------------------------------------------------------------------------
# Helpers – create fake user / subscription objects
# ---------------------------------------------------------------------------
def make_user(**overrides):
    now = datetime.now(timezone.utc)
    defaults = dict(
        id=uuid.uuid4(),
        email="user@example.com",
        username="test_user",
        full_name="Test User",
        role=UserRole.USER,
        is_active=True,
        created_at=now,
        updated_at=now,
    )
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


def make_subscription(user_id, **overrides):
    now = datetime.now(timezone.utc)
    defaults = dict(
        id=uuid.uuid4(),
        user_id=user_id,
        token_limit=1000,
        tokens_used=100,
        usage_percentage=10.0,
        start_date=now,
        end_date=now + timedelta(days=30),
        status=SubscriptionStatus.ACTIVE,
    )
    defaults.update(overrides)
    return SimpleNamespace(**defaults)


# ===================================================================
#  Admin – Create User
# ===================================================================
def test_admin_can_create_user(monkeypatch):
    user = make_user()
    subscription = make_subscription(user.id)
    create_mock = AsyncMock(return_value=(user, subscription))
    monkeypatch.setattr(admin_user_service, "create_user_account", create_mock)

    response = client.post(
        "/api/v1/admin/users",
        json={
            "email": "user@example.com",
            "username": "test_user",
            "full_name": "Test User",
            "password": "password1",
            "token_limit": 1000,
            "start_date": datetime.now(timezone.utc).isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["action"] == "create"
    assert data["user"]["email"] == "user@example.com"
    assert data["user"]["username"] == "test_user"
    assert data["user"]["subscription"]["token_limit"] == 1000


def test_admin_create_user_rejects_invalid_dates():
    now = datetime.now(timezone.utc)

    response = client.post(
        "/api/v1/admin/users",
        json={
            "email": "user@example.com",
            "username": "test_user",
            "full_name": "Test User",
            "password": "password1",
            "token_limit": 1000,
            "start_date": now.isoformat(),
            "end_date": (now - timedelta(days=1)).isoformat(),
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "end_date must be after start_date."


def test_admin_create_user_rejects_weak_password():
    """Password without digit/special char should be rejected by Pydantic."""
    now = datetime.now(timezone.utc)

    response = client.post(
        "/api/v1/admin/users",
        json={
            "email": "user@example.com",
            "username": "test_user",
            "full_name": "Test User",
            "password": "onlyletters",
            "token_limit": 1000,
            "start_date": now.isoformat(),
            "end_date": (now + timedelta(days=30)).isoformat(),
        },
    )

    assert response.status_code == 422


def test_admin_create_user_rejects_short_username():
    """Username shorter than 3 chars should be rejected."""
    now = datetime.now(timezone.utc)

    response = client.post(
        "/api/v1/admin/users",
        json={
            "email": "user@example.com",
            "username": "ab",
            "full_name": "Test User",
            "password": "password1",
            "token_limit": 1000,
            "start_date": now.isoformat(),
            "end_date": (now + timedelta(days=30)).isoformat(),
        },
    )

    assert response.status_code == 422


# ===================================================================
#  Admin – Delete User
# ===================================================================
def test_admin_can_delete_user(monkeypatch):
    user = make_user()
    delete_mock = AsyncMock(return_value=user)
    monkeypatch.setattr(admin_user_service, "delete_user_account", delete_mock)

    response = client.delete(f"/api/v1/admin/users/{user.id}")

    assert response.status_code == 200
    assert response.json()["action"] == "delete"
    assert response.json()["user"]["id"] == str(user.id)


def test_admin_delete_nonexistent_user(monkeypatch):
    """Deleting a user that doesn't exist should return 404."""
    monkeypatch.setattr(
        admin_user_service,
        "delete_user_account",
        AsyncMock(side_effect=admin_user_service.NotFoundError("User not found.")),
    )

    fake_id = uuid.uuid4()
    response = client.delete(f"/api/v1/admin/users/{fake_id}")

    assert response.status_code == 404
    assert response.json()["detail"] == "User not found."


# ===================================================================
#  Admin – Renew Subscription
# ===================================================================
def test_admin_can_renew_subscription(monkeypatch):
    user = make_user()
    subscription = make_subscription(user.id)
    renew_mock = AsyncMock(return_value=(user, subscription))
    monkeypatch.setattr(admin_user_service, "renew_user_subscription", renew_mock)

    response = client.patch(
        f"/api/v1/admin/users/{user.id}/renew",
        json={"end_date": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat()},
    )

    assert response.status_code == 200
    assert response.json()["action"] == "renew"
    assert response.json()["user"]["subscription"]["status"] == "active"


def test_admin_renew_rejects_past_date():
    """Renewing with a past end_date should fail."""
    fake_id = uuid.uuid4()
    response = client.patch(
        f"/api/v1/admin/users/{fake_id}/renew",
        json={"end_date": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
    )

    assert response.status_code == 422
    assert "end_date must be in the future" in response.json()["detail"]


# ===================================================================
#  Admin – Add Tokens
# ===================================================================
def test_admin_can_add_tokens(monkeypatch):
    user = make_user()
    subscription = make_subscription(user.id)
    add_tokens_mock = AsyncMock(return_value=(user, subscription))
    monkeypatch.setattr(admin_user_service, "add_user_tokens", add_tokens_mock)

    response = client.patch(f"/api/v1/admin/users/{user.id}/tokens", json={"tokens": 500})

    assert response.status_code == 200
    assert response.json()["action"] == "add_tokens"
    assert response.json()["user"]["subscription"]["token_limit"] == 1000


def test_admin_add_tokens_rejects_zero(monkeypatch):
    """Token count must be > 0."""
    fake_id = uuid.uuid4()
    response = client.patch(f"/api/v1/admin/users/{fake_id}/tokens", json={"tokens": 0})

    assert response.status_code == 422


def test_admin_add_tokens_rejects_negative(monkeypatch):
    """Negative token count should fail."""
    fake_id = uuid.uuid4()
    response = client.patch(f"/api/v1/admin/users/{fake_id}/tokens", json={"tokens": -100})

    assert response.status_code == 422


# ===================================================================
#  Auth – Login
# ===================================================================
def test_user_can_login_with_email_and_password(monkeypatch):
    user = make_user()
    subscription = make_subscription(user.id)
    login_mock = AsyncMock(return_value=(user, subscription))
    monkeypatch.setattr(admin_user_service, "login_user", login_mock)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "password1"},
    )

    assert response.status_code == 200
    assert response.json()["message"] == "Login successful."
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
    assert response.json()["user"]["email"] == "user@example.com"
    assert "refresh_token" in response.cookies


def test_login_invalid_credentials(monkeypatch):
    """Wrong password should return 401."""
    monkeypatch.setattr(
        admin_user_service,
        "login_user",
        AsyncMock(side_effect=admin_user_service.UnauthorizedError("Invalid email or password.")),
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "wrong"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_login_inactive_user(monkeypatch):
    """Inactive user should return 401."""
    monkeypatch.setattr(
        admin_user_service,
        "login_user",
        AsyncMock(side_effect=admin_user_service.UnauthorizedError("User account is inactive.")),
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "inactive@example.com", "password": "password1"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "User account is inactive."


# ===================================================================
#  Auth – Refresh Token
# ===================================================================
def test_user_can_refresh_token(monkeypatch):
    user = make_user()

    # Mock decoding the token to return the user id
    from jose import jwt
    monkeypatch.setattr(jwt, "decode", lambda *args, **kwargs: {"sub": str(user.id), "type": "refresh"})

    get_user_mock = AsyncMock(return_value=user)
    monkeypatch.setattr(admin_user_service, "get_user_by_id", get_user_mock)

    client.cookies.set("refresh_token", "fake_refresh_token")
    response = client.post("/api/v1/auth/refresh")

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
    assert "refresh_token" in response.cookies


def test_refresh_without_cookie():
    """Missing refresh_token cookie should return 401."""
    fresh_client = TestClient(app)
    response = fresh_client.post("/api/v1/auth/refresh")

    assert response.status_code == 401
    assert response.json()["detail"] == "Refresh token missing"


# ===================================================================
#  Health Check
# ===================================================================
def test_health_check():
    """Root endpoint should return status online."""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "project" in data
    assert "message" in data
