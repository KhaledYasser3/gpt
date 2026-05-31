import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.chat import MessageRole

# --- Message Schemas ---

class MessageBase(BaseModel):
    role: MessageRole = Field(..., description="Message role: 'user', 'assistant', or 'system'")
    content: str = Field(..., min_length=1, description="Content of the message")

class MessageCreate(MessageBase):
    input_tokens: Optional[int] = Field(0, ge=0)
    output_tokens: Optional[int] = Field(0, ge=0)
    total_tokens: Optional[int] = Field(0, ge=0)

class MessageResponse(MessageBase):
    id: uuid.UUID
    chat_id: uuid.UUID
    input_tokens: int
    output_tokens: int
    total_tokens: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Chat Schemas ---

class ChatBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the chat thread")

class ChatCreate(ChatBase):
    pass

class ChatUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)

class ChatResponse(ChatBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Usage Log Schemas ---

class UsageLogResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    subscription_id: uuid.UUID
    chat_id: uuid.UUID
    message_id: uuid.UUID
    input_tokens: int
    output_tokens: int
    total_tokens: int
    created_at: datetime

    class Config:
        from_attributes = True
