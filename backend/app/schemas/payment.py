import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.payment import PaymentMethod, PaymentStatus

class PaymentBase(BaseModel):
    payment_method: PaymentMethod = Field(..., description="Payment method used: 'paypal' or 'vodafone_cash'")
    amount: float = Field(..., gt=0.0, description="Amount paid must be greater than zero")
    receipt_url: str = Field(..., min_length=5, description="URL to the receipt image or document")

class PaymentCreate(PaymentBase):
    request_id: uuid.UUID

class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    admin_note: Optional[str] = None

class PaymentResponse(PaymentBase):
    id: uuid.UUID
    request_id: uuid.UUID
    user_id: uuid.UUID
    status: PaymentStatus
    admin_note: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
