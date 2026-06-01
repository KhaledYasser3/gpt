import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class SettingBase(BaseModel):
    site_name: str = Field("AI Chat SaaS", min_length=2, max_length=100, description="Name of the platform")
    support_email: Optional[EmailStr] = Field(None, description="Contact email for support inquiries")

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    site_name: Optional[str] = Field(None, min_length=2, max_length=100)
    support_email: Optional[EmailStr] = None

class SettingResponse(SettingBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
