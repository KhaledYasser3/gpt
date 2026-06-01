from fastapi import APIRouter

from app.routes.admin import router as admin_router
from app.routes.auth import router as auth_router

api_router = APIRouter()
api_router.include_router(admin_router)
api_router.include_router(auth_router)
