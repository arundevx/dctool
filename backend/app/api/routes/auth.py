from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel, EmailStr
from app.db.database import get_db
from app.db.models import User, UserRole, SiteSetting
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class EmailCheck(BaseModel):
    email: EmailStr

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/check-email")
async def check_email(data: EmailCheck, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    return {"exists": user is not None}

@router.post("/register")
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if registration is enabled
    # We always allow the very first user to register (to become admin)
    count_result = await db.execute(select(func.count(User.id)))
    user_count = count_result.scalar() or 0

    if user_count > 0:
        reg_setting_result = await db.execute(select(SiteSetting).where(SiteSetting.key == "registration_enabled"))
        reg_setting = reg_setting_result.scalars().first()
        # Default is true if not set
        is_enabled = reg_setting.value.lower() == "true" if reg_setting else True
        if not is_enabled:
            raise HTTPException(status_code=403, detail="Registration is currently disabled")
    
    user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=UserRole.ADMIN if user_count == 0 else UserRole.USER
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}
