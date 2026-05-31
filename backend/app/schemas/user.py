import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's unique email address")
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
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    password: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

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
