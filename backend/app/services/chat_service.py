import uuid
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import Chat, Message
from app.core.enums import MessageRole
from app.services.admin_user_service import NotFoundError, UnauthorizedError

async def create_chat(db: AsyncSession, user_id: uuid.UUID, title: str, project_id: uuid.UUID = None) -> Chat:
    chat = Chat(user_id=user_id, title=title, project_id=project_id)
    db.add(chat)
    await db.flush()
    await db.refresh(chat)
    return chat

async def get_user_chats(db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID = None) -> Sequence[Chat]:
    stmt = select(Chat).where(Chat.user_id == user_id)
    if project_id is not None:
        stmt = stmt.where(Chat.project_id == project_id)
    else:
        stmt = stmt.where(Chat.project_id == None)
        
    result = await db.execute(stmt.order_by(Chat.updated_at.desc()))
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

from fastapi import BackgroundTasks, UploadFile
from typing import List, Optional
from app.services.ai_service import generate_ai_response, evaluate_and_update_interests, summarize_chat
from app.core.database import SessionLocal
from app.models.user import User
from app.services.file_service import extract_text_from_file

async def background_post_message_tasks(user_id: uuid.UUID, chat_id: uuid.UUID, new_message_content: str):
    async with SessionLocal() as db:
        user = await db.get(User, user_id)
        chat = await db.get(Chat, chat_id)
        
        # update interests
        new_interests = await evaluate_and_update_interests(user.interests_summary, new_message_content)
        if new_interests != user.interests_summary:
            user.interests_summary = new_interests
            
        # check if we need to summarize (every 10 messages)
        result = await db.execute(
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
        )
        messages = result.scalars().all()
        if len(messages) > 0 and len(messages) % 10 == 0:
            # summarize the last 10 messages
            new_summary = await summarize_chat(chat.summary, messages[-10:])
            chat.summary = new_summary
            
        await db.commit()

async def create_message(db: AsyncSession, user_id: uuid.UUID, chat_id: uuid.UUID, content: str, files: Optional[List[UploadFile]] = None, background_tasks: BackgroundTasks = None) -> list[Message]:
    # Ensure user owns the chat
    chat = await get_chat_by_id_for_user(db, user_id, chat_id)
    user = await db.get(User, user_id)
    
    # Process attached files
    file_texts = []
    image_data_list = []
    if files:
        for f in files:
            extracted = await extract_text_from_file(f)
            if extracted["is_image"] and extracted["image_bytes"]:
                import base64
                b64 = base64.b64encode(extracted["image_bytes"]).decode("utf-8")
                image_data_list.append({
                    "filename": extracted["filename"],
                    "mime": extracted["content_type"],
                    "base64": b64,
                })
            elif extracted["extracted_text"]:
                file_texts.append(f'--- Content of file: {extracted["filename"]} ---\n{extracted["extracted_text"]}\n--- End of file ---')
    
    # Build full content for storage (what the user sees)
    display_content = content
    if files:
        file_names = [f.filename for f in files]
        display_content += '\n[Attached files: ' + ', '.join(file_names) + ']'
    
    # Build AI-facing content (includes extracted text)
    ai_content = content
    if file_texts:
        ai_content += '\n\n' + '\n\n'.join(file_texts)
    
    # Create User Message (store display version)
    user_msg = Message(
        chat_id=chat_id,
        role=MessageRole.USER,
        content=display_content,
        input_tokens=0,
        output_tokens=0,
        total_tokens=0
    )
    db.add(user_msg)
    await db.flush()
    
    # Fetch full chat history for AI context
    if chat.project_id:
        # Fetch messages from all chats in the project
        project_chats_stmt = select(Chat.id).where(Chat.project_id == chat.project_id)
        result = await db.execute(
            select(Message)
            .where(Message.chat_id.in_(project_chats_stmt))
            .order_by(Message.created_at.asc())
        )
        history_for_ai = result.scalars().all()
    else:
        history_for_ai = await get_chat_messages(db, user_id, chat_id)
        
    # History for the frontend (only current chat)
    history_for_frontend = await get_chat_messages(db, user_id, chat_id)

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

    # Slice history_for_ai to only the last 20 messages to save tokens
    history_for_ai = history_for_ai[-20:]

    # Call OpenAI API with file content
    # Replace the last user message content with ai_content (includes extracted file text)
    ai_text = await generate_ai_response(
        history_for_ai, 
        chat_summary=chat.summary, 
        user_interests=user.interests_summary,
        current_msg_override=ai_content,
        image_data_list=image_data_list if image_data_list else None
    )
    
    # Trigger background tasks
    if background_tasks:
        background_tasks.add_task(background_post_message_tasks, user_id, chat_id, content)
    
    # Estimate tokens (1 token ~ 4 chars)
    estimated_input_tokens = sum(len(m.content) for m in history_for_ai) // 4
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
    
    # Return full chat history for the current chat
    # The frontend expects the full list of messages
    full_history = list(history_for_frontend)
    full_history.append(assistant_msg)
    return full_history

