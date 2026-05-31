import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum, ForeignKey, Numeric, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class RequestStatus(str, enum.Enum):
    PENDING_PRICING = "pending_pricing"
    PRICE_SENT = "price_sent"
    WAITING_PAYMENT = "waiting_payment"
    PAYMENT_REVIEW = "payment_review"
    APPROVED = "approved"
    REJECTED = "rejected"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    SUSPENDED = "suspended"

class SubscriptionRequest(Base):
    __tablename__ = "subscription_requests"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    status: Mapped[RequestStatus] = mapped_column(
        Enum(RequestStatus, name="request_status"), 
        default=RequestStatus.PENDING_PRICING, 
        nullable=False
    )
    admin_note: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    user = relationship("User", backref="subscription_requests")


class SubscriptionOffer(Base):
    __tablename__ = "subscription_offers"
    
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
    monthly_price: Mapped[float] = mapped_column(
        Numeric(10, 2), 
        nullable=False
    )
    currency: Mapped[str] = mapped_column(
        String(10), 
        default="USD", 
        nullable=False
    )
    token_limit: Mapped[int] = mapped_column(
        BigInteger, 
        nullable=False
    )
    offer_note: Mapped[str] = mapped_column(
        String, 
        nullable=True
    )
    is_accepted: Mapped[bool] = mapped_column(
        Boolean, 
        default=False, 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    request = relationship("SubscriptionRequest", backref="offers")


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False
    )
    offer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("subscription_offers.id", ondelete="SET NULL"), 
        nullable=True
    )
    monthly_price: Mapped[float] = mapped_column(
        Numeric(10, 2), 
        nullable=False
    )
    token_limit: Mapped[int] = mapped_column(
        BigInteger, 
        nullable=False
    )
    tokens_used: Mapped[int] = mapped_column(
        BigInteger, 
        default=0, 
        nullable=False
    )
    usage_percentage: Mapped[float] = mapped_column(
        Numeric(5, 2), 
        default=0.00, 
        nullable=False
    )
    start_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    end_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )
    status: Mapped[SubscriptionStatus] = mapped_column(
        Enum(SubscriptionStatus, name="subscription_status"), 
        default=SubscriptionStatus.ACTIVE, 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        onupdate=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    user = relationship("User", backref="subscriptions")
    offer = relationship("SubscriptionOffer", backref="subscriptions")
