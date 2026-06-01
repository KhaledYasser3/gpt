import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.core.enums import AdminUserAction, SubscriptionStatus, UserRole

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's unique email address")
    username: str = Field(..., min_length=3, max_length=100, pattern=r"^[A-Za-z0-9_.-]+$")
    full_name: str = Field(..., min_length=2, max_length=100, description="User's full name (2-100 characters)")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        # Password must contain at least one number or special character
        if not any(c.isdigit() or not c.isalnum() for c in v):
            raise ValueError("Password must contain at least one digit or special character.")
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=100, pattern=r"^[A-Za-z0-9_.-]+$")
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

class AdminUserCreate(UserCreate):
    token_limit: int = Field(..., gt=0)
    start_date: datetime
    end_date: datetime

class AdminRenewSubscription(BaseModel):
    end_date: datetime

class AdminAddTokens(BaseModel):
    tokens: int = Field(..., gt=0)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class UserInDBBase(UserBase):
    id: uuid.UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 configuration for ORM compatibility

class UserResponse(UserInDBBase):
    pass

class AdminSubscriptionResponse(BaseModel):
    id: uuid.UUID
    token_limit: int
    tokens_used: int
    usage_percentage: float
    start_date: datetime
    end_date: datetime
    status: SubscriptionStatus

    class Config:
        from_attributes = True

class AdminUserResponse(UserResponse):
    subscription: Optional[AdminSubscriptionResponse] = None

class AdminActionResponse(BaseModel):
    action: AdminUserAction
    message: str
    user: Optional[AdminUserResponse] = None
