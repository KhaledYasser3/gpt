import asyncio
import os
import sys

from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.user import User
from app.core.enums import UserRole
from app.services.admin_user_service import hash_password

async def create_superuser():
    async with SessionLocal() as db:
        admin_email = "admin@example.com"
        result = await db.execute(select(User).where(User.email == admin_email))
        admin_user = result.scalar_one_or_none()

        if admin_user:
            print(f"Admin user {admin_email} already exists!")
            return

        print("Creating admin user...")
        new_admin = User(
            email=admin_email,
            username="admin",
            full_name="System Admin",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add(new_admin)
        await db.commit()
        print(f"Admin user created successfully! Email: {admin_email}, Password: admin123")

if __name__ == "__main__":
    asyncio.run(create_superuser())
