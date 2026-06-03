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

from app.services.ai_service import generate_ai_response

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
    await db.flush()
    
    # Fetch full chat history for AI context
    history = await get_chat_messages(db, user_id, chat_id)

    # Fetch subscription and check token limit BEFORE calling AI
    from app.services.admin_user_service import get_latest_subscription, calculate_usage_percentage
    from fastapi import HTTPException
    subscription = await get_latest_subscription(db, user_id)
    if subscription and subscription.token_limit > 0:
        if subscription.tokens_used >= subscription.token_limit:
            raise HTTPException(
                status_code=402,
                detail=f"Token limit reached. You have used {subscription.tokens_used}/{subscription.token_limit} tokens. Please contact your administrator."
            )

    # Call Groq AI API
    ai_text = await generate_ai_response(history)
    
    # Estimate tokens (1 token ~ 4 chars)
    estimated_input_tokens = sum(len(m.content) for m in history) // 4
    estimated_output_tokens = len(ai_text) // 4
    total = estimated_input_tokens + estimated_output_tokens

    # Update user's token usage in subscription
    if subscription:
        subscription.tokens_used += total
        subscription.usage_percentage = calculate_usage_percentage(
            subscription.tokens_used,
            subscription.token_limit,
        )

    # Create AI Message
    assistant_msg = Message(
        chat_id=chat_id,
        role=MessageRole.ASSISTANT,
        content=ai_text,
        input_tokens=estimated_input_tokens,
        output_tokens=estimated_output_tokens,
        total_tokens=total
    )
    db.add(assistant_msg)
    
    await db.flush()
    await db.refresh(user_msg)
    await db.refresh(assistant_msg)
    
    # Return full chat history
    # The frontend expects the full list of messages
    full_history = list(history)
    full_history.append(assistant_msg)
    return full_history

