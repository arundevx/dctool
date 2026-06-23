from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List

from app.db.database import get_db
from app.db.models import User, UserRole
from app.api.deps import get_current_active_user, get_current_admin
from app.core.security import get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True

class PasswordUpdate(BaseModel):
    new_password: str

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me/password")
async def update_password(
    data: PasswordUpdate, 
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.hashed_password = get_password_hash(data.new_password)
    db.add(current_user)
    await db.commit()
    return {"message": "Password updated successfully"}

@router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User))
    return result.scalars().all()

class RoleUpdate(BaseModel):
    role: UserRole

@router.put("/admin/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    data: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = data.role
    db.add(user)
    await db.commit()
    return {"message": "Role updated successfully"}

@router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted"}
