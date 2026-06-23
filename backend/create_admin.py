import asyncio
from app.db.database import AsyncSessionLocal
from app.db.models import User, UserRole
from app.core.security import get_password_hash
from sqlalchemy.future import select

async def create_admin():
    async with AsyncSessionLocal() as db:
        # Check if user already exists
        result = await db.execute(select(User).where(User.email == "arun@gmail.com"))
        user = result.scalars().first()
        if user:
            print(f"User arun@gmail.com already exists. Updating role to ADMIN.")
            user.role = UserRole.ADMIN
            user.hashed_password = get_password_hash("admin123")
        else:
            print("Creating new admin user: arun@gmail.com")
            user = User(
                email="arun@gmail.com",
                hashed_password=get_password_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(user)
        
        await db.commit()
        print("Done! Login with email: arun@gmail.com, password: admin123")

if __name__ == "__main__":
    asyncio.run(create_admin())
