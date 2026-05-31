import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Setting(Base):
    __tablename__ = "settings"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    site_name: Mapped[str] = mapped_column(
        String(255), 
        default="AI Chat SaaS", 
        nullable=False
    )
    support_email: Mapped[str] = mapped_column(
        String(255), 
        nullable=True
    )
    paypal_email: Mapped[str] = mapped_column(
        String(255), 
        nullable=True
    )
    vodafone_cash_number: Mapped[str] = mapped_column(
        String(50), 
        nullable=True
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
