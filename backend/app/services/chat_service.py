import uuid
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import Chat, Message
from app.core.enums import MessageRole
from app.services.admin_user_service import NotFoundError, UnauthorizedError

async def create_chat(db: AsyncSession, user_id: uuid.UUID, title: str) -> Chat:
    chat = Chat(user_id=user_id, title=title)
    db.add(chat)
    await db.flush()
    await db.refresh(chat)
    return chat

async def get_user_chats(db: AsyncSession, user_id: uuid.UUID) -> Sequence[Chat]:
    result = await db.execute(
        select(Chat)
        .where(Chat.user_id == user_id)
        .order_by(Chat.updated_at.desc())
    )
    return result.scalars().all()

async def get_chat_by_id_for_user(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID) -> Chat:
    chat = await db.get(Chat, chat_id)
    if not chat:
        raise NotFoundError("Chat not found.")
    if chat.user_id != user_id:
        raise UnauthorizedError("Access to this chat is forbidden.")
    return chat

async def rename_chat(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID, title: str) -> Chat:
    chat = await get_chat_by_id_for_user(db, user_id, chat_id)
    chat.title = title
    await db.flush()
    await db.refresh(chat)
    return chat

async def delete_chat(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID) -> Chat:
    chat = await get_chat_by_id_for_user(db, user_id, chat_id)
    await db.delete(chat)
    return chat

async def get_chat_messages(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID) -> Sequence[Message]:
    # Ensure user owns the chat
    await get_chat_by_id_for_user(db, user_id, chat_id)
    
    result = await db.execute(
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
    )
    return result.scalars().all()

async def create_message(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID, content: str) -> list[Message]:
    # Ensure user owns the chat
    await get_chat_by_id_for_user(db, user_id, chat_id)
    
    # Create User Message
    user_msg = Message(
        chat_id=chat_id,
        role=MessageRole.USER,
        content=content,
        input_tokens=0,
        output_tokens=0,
        total_tokens=0
    )
    db.add(user_msg)
    
    # Create Mock Assistant Message
    assistant_msg = Message(
        chat_id=chat_id,
        role=MessageRole.ASSISTANT,
        content="Mock AI Response",
        input_tokens=0,
        output_tokens=0,
        total_tokens=0
    )
    db.add(assistant_msg)
    
    await db.flush()
    await db.refresh(user_msg)
    await db.refresh(assistant_msg)
    
    return [user_msg, assistant_msg]
