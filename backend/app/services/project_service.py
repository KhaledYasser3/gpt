import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.project import Project
from app.services.admin_user_service import ServiceError


async def create_project(db: AsyncSession, user_id: uuid.UUID, name: str, description: str = None) -> Project:
    project = Project(user_id=user_id, name=name, description=description)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def get_user_projects(db: AsyncSession, user_id: uuid.UUID) -> List[Project]:
    result = await db.execute(
        select(Project)
        .where(Project.user_id == user_id)
        .order_by(Project.updated_at.desc())
    )
    return result.scalars().all()


async def get_project(db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID) -> Project:
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.user_id == user_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise ServiceError(404, "Project not found")
    return project


async def update_project(db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID, name: str = None, description: str = None) -> Project:
    project = await get_project(db, user_id, project_id)
    if name is not None:
        project.name = name
    if description is not None:
        project.description = description
    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, user_id: uuid.UUID, project_id: uuid.UUID) -> Project:
    project = await get_project(db, user_id, project_id)
    await db.delete(project)
    await db.commit()
    return project
