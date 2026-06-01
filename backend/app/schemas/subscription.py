import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.core.enums import SubscriptionStatus

class SubscriptionBase(BaseModel):
    token_limit: int = Field(..., gt=0, description="Token quota limit must be a positive integer")
    start_date: datetime
    end_date: datetime

class SubscriptionCreate(SubscriptionBase):
    user_id: uuid.UUID

class SubscriptionUpdate(BaseModel):
    token_limit: Optional[int] = Field(None, gt=0)
    tokens_used: Optional[int] = None
    usage_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[SubscriptionStatus] = None

class SubscriptionResponse(SubscriptionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    tokens_used: int
    usage_percentage: float
    status: SubscriptionStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
