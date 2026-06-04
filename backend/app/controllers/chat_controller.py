import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import chat_service
from app.services.admin_user_service import ServiceError
from app.schemas.chat import ChatCreate, ChatUpdate, MessageCreate

def service_error_to_http(error: ServiceError) -> HTTPException:
    return HTTPException(status_code=error.status_code, detail=error.message)

async def create_chat(user_id: uuid.UUID, payload: ChatCreate, db: AsyncSession):
    try:
        return await chat_service.create_chat(db, user_id=user_id, title=payload.title, project_id=payload.project_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

async def get_user_chats(user_id: uuid.UUID, db: AsyncSession, project_id: uuid.UUID = None):
    try:
        return await chat_service.get_user_chats(db, user_id=user_id, project_id=project_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

async def rename_chat(user_id: uuid.UUID, chat_id: uuid.UUID, payload: ChatUpdate, db: AsyncSession):
    if not payload.title:
        raise HTTPException(status_code=422, detail="Title is required")
    try:
        return await chat_service.rename_chat(db, user_id=user_id, chat_id=chat_id, title=payload.title)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

async def delete_chat(user_id: uuid.UUID, chat_id: uuid.UUID, db: AsyncSession):
    try:
        return await chat_service.delete_chat(db, user_id=user_id, chat_id=chat_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

async def get_chat_messages(user_id: uuid.UUID, chat_id: uuid.UUID, db: AsyncSession):
    try:
        return await chat_service.get_chat_messages(db, user_id=user_id, chat_id=chat_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

from fastapi import BackgroundTasks, UploadFile
from typing import List, Optional

async def add_message(user_id: uuid.UUID, chat_id: uuid.UUID, content: str, files: Optional[List[UploadFile]], background_tasks: BackgroundTasks, db: AsyncSession):
    try:
        return await chat_service.create_message(db, user_id=user_id, chat_id=chat_id, content=content, files=files, background_tasks=background_tasks)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc

