import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import project_service
from app.services.admin_user_service import ServiceError
from app.schemas.project import ProjectCreate, ProjectUpdate


def service_error_to_http(error: ServiceError) -> HTTPException:
    return HTTPException(status_code=error.status_code, detail=error.message)


async def create_project(user_id: uuid.UUID, payload: ProjectCreate, db: AsyncSession):
    try:
        return await project_service.create_project(
            db, user_id=user_id, name=payload.name, description=payload.description
        )
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc


async def get_user_projects(user_id: uuid.UUID, db: AsyncSession):
    try:
        return await project_service.get_user_projects(db, user_id=user_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc


async def update_project(user_id: uuid.UUID, project_id: uuid.UUID, payload: ProjectUpdate, db: AsyncSession):
    try:
        return await project_service.update_project(
            db, user_id=user_id, project_id=project_id,
            name=payload.name, description=payload.description
        )
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc


async def delete_project(user_id: uuid.UUID, project_id: uuid.UUID, db: AsyncSession):
    try:
        return await project_service.delete_project(db, user_id=user_id, project_id=project_id)
    except ServiceError as exc:
        raise service_error_to_http(exc) from exc
