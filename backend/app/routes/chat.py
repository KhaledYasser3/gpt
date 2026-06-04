import uuid
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers import chat_controller
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatResponse, ChatUpdate, MessageCreate, MessageResponse

router = APIRouter(prefix="/chats", tags=["Chats"])

@router.post("", response_model=ChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(
    payload: ChatCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.create_chat(current_user.id, payload, db)

@router.get("", response_model=List[ChatResponse])
async def get_chats(
    project_id: uuid.UUID = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.get_user_chats(current_user.id, db, project_id)

@router.put("/{chat_id}", response_model=ChatResponse)
async def rename_chat(
    chat_id: uuid.UUID,
    payload: ChatUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.rename_chat(current_user.id, chat_id, payload, db)

@router.delete("/{chat_id}", response_model=ChatResponse)
async def delete_chat(
    chat_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.delete_chat(current_user.id, chat_id, db)

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_chat_messages(
    chat_id: uuid.UUID,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.get_chat_messages(current_user.id, chat_id, db)

from fastapi import BackgroundTasks, UploadFile, File, Form
from typing import Optional

@router.post("/{chat_id}/messages", response_model=List[MessageResponse], status_code=status.HTTP_201_CREATED)
async def add_message(
    chat_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    content: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    return await chat_controller.add_message(current_user.id, chat_id, content, files, background_tasks, db)

