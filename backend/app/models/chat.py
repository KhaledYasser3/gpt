import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.enums import MessageRole
from app.models.base import Base

class Chat(Base):
    __tablename__ = "chats"
    
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
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True
    )
    title: Mapped[str] = mapped_column(
        String(255), 
        nullable=False
    )
    summary: Mapped[str] = mapped_column(
        String,
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

    # Relationships
    user = relationship("User", backref="chats")
    project = relationship("Project", backref="chats")


class Message(Base):
    __tablename__ = "messages"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    chat_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("chats.id", ondelete="CASCADE"), 
        nullable=False
    )
    role: Mapped[MessageRole] = mapped_column(
        Enum(MessageRole, name="message_role"), 
        nullable=False
    )
    content: Mapped[str] = mapped_column(
        String, 
        nullable=False
    )
    input_tokens: Mapped[int] = mapped_column(
        Integer, 
        default=0, 
        nullable=False
    )
    output_tokens: Mapped[int] = mapped_column(
        Integer, 
        default=0, 
        nullable=False
    )
    total_tokens: Mapped[int] = mapped_column(
        Integer, 
        default=0, 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    chat = relationship("Chat", backref="messages")


class UsageLog(Base):
    __tablename__ = "usage_logs"
    
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
    subscription_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("subscriptions.id", ondelete="CASCADE"), 
        nullable=False
    )
    chat_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("chats.id", ondelete="CASCADE"), 
        nullable=False
    )
    message_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("messages.id", ondelete="CASCADE"), 
        nullable=False
    )
    input_tokens: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    output_tokens: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    total_tokens: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc), 
        nullable=False
    )

    # Relationships
    user = relationship("User", backref="usage_logs")
    subscription = relationship("Subscription", backref="usage_logs")
    chat = relationship("Chat", backref="usage_logs")
    message = relationship("Message", backref="usage_logs")
