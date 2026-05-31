import re
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class SettingBase(BaseModel):
    site_name: str = Field("AI Chat SaaS", min_length=2, max_length=100, description="Name of the platform")
    support_email: Optional[EmailStr] = Field(None, description="Contact email for support inquiries")
    paypal_email: Optional[EmailStr] = Field(None, description="Merchant Paypal email to receive payments")
    vodafone_cash_number: Optional[str] = Field(None, description="Vodafone Cash mobile number to receive payments")

    @field_validator("vodafone_cash_number")
    @classmethod
    def validate_vodafone_cash(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return None
        
        # Remove whitespaces, hyphens, or brackets
        cleaned = re.sub(r"[\s\-\(\)]", "", v)
        
        # Egyptian mobile number pattern: optional +2 or 2 followed by 010, 011, 012, or 015 and 8 digits
        pattern = r"^(?:\+?2)?01[0125]\d{8}$"
        if not re.match(pattern, cleaned):
            raise ValueError(
                "Vodafone Cash number must be a valid Egyptian mobile number (e.g. 010XXXXXXXX or +2010XXXXXXXX)"
            )
        return cleaned

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    site_name: Optional[str] = Field(None, min_length=2, max_length=100)
    support_email: Optional[EmailStr] = None
    paypal_email: Optional[EmailStr] = None
    vodafone_cash_number: Optional[str] = None

    @field_validator("vodafone_cash_number")
    @classmethod
    def validate_vodafone_cash(cls, v: Optional[str]) -> Optional[str]:
        return SettingBase.validate_vodafone_cash(v)

class SettingResponse(SettingBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
