import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class PaymentMethod(str, enum.Enum):
    PAYPAL = "paypal"
    VODAFONE_CASH = "vodafone_cash"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Payment(Base):
    __tablename__ = "payments"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("subscription_requests.id", ondelete="CASCADE"), 
        nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    payment_method: Mapped[PaymentMethod] = mapped_column(
        Enum(PaymentMethod, name="payment_method"), 
        nullable=False
    )
    amount: Mapped[float] = mapped_column(
        Numeric(10, 2), 
        nullable=False
    )
    receipt_url: Mapped[str] = mapped_column(
        String, 
        nullable=True
    )
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"), 
        default=PaymentStatus.PENDING, 
        nullable=False
    )
    admin_note: Mapped[str] = mapped_column(
        String, 
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    reviewed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )

    # Relationships
    user = relationship("User", backref="payments")
    request = relationship("SubscriptionRequest", backref="payments")
