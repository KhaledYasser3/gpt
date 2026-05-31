import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.models.subscription import RequestStatus, SubscriptionStatus

# --- Subscription Request Schemas ---

class SubscriptionRequestBase(BaseModel):
    pass

class SubscriptionRequestCreate(SubscriptionRequestBase):
    # Standard request doesn't need input, user clicks "Request Subscription" and it links to active user
    pass

class SubscriptionRequestUpdate(BaseModel):
    status: Optional[RequestStatus] = None
    admin_note: Optional[str] = None

class SubscriptionRequestResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: RequestStatus
    admin_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Subscription Offer Schemas ---

class SubscriptionOfferBase(BaseModel):
    monthly_price: float = Field(..., gt=0.0, description="Monthly price must be greater than zero")
    currency: str = Field("USD", min_length=2, max_length=10, description="Currency e.g. USD, EGP")
    token_limit: int = Field(..., gt=0, description="Token quota limit must be a positive integer")
    offer_note: Optional[str] = None

class SubscriptionOfferCreate(SubscriptionOfferBase):
    request_id: uuid.UUID

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, v: str) -> str:
        allowed = ["USD", "EGP", "EUR", "GBP"]
        upper_v = v.upper()
        if upper_v not in allowed:
            raise ValueError(f"Currency must be one of {allowed}")
        return upper_v

class SubscriptionOfferUpdate(BaseModel):
    is_accepted: Optional[bool] = None
    offer_note: Optional[str] = None

class SubscriptionOfferResponse(SubscriptionOfferBase):
    id: uuid.UUID
    request_id: uuid.UUID
    is_accepted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Subscription Schemas ---

class SubscriptionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    offer_id: Optional[uuid.UUID] = None
    monthly_price: float
    token_limit: int
    tokens_used: int
    usage_percentage: float
    start_date: datetime
    end_date: datetime
    status: SubscriptionStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
