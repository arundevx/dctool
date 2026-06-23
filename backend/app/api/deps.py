from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import ValidationError

from app.core.config import settings
from app.db.database import get_db
from app.db.models import User, ToolUsage, SiteSetting, ToolSetting

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    return current_user

async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user

async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id:
            result = await db.execute(select(User).where(User.id == int(user_id)))
            return result.scalars().first()
    except:
        return None
    return None

async def check_usage_limit(
    request: Request,
    user: User | None = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Dependency to enforce the 3 uses limit for guest users.
    Should be added to tool usage endpoints.
    """
    # Identify the tool (use the X-Tool-Id header sent by frontend, e.g., /tools/image/remove-bg)
    tool_id = request.headers.get("X-Tool-Id", request.url.path)

    # Check if tool is disabled globally
    tool_setting_result = await db.execute(select(ToolSetting).where(ToolSetting.tool_id == tool_id))
    tool_setting = tool_setting_result.scalars().first()

    if tool_setting and not tool_setting.is_enabled:
        raise HTTPException(
            status_code=503,
            detail="Tool Currently Down for Maintenance"
        )

    if user:
        yield True # Authenticated users bypass usage limits
        return
    
    # Get IP address
    ip_address = request.client.host if request.client else "unknown"
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()

    # Get global guest limit (default to 3 if not set)
    global_limit_result = await db.execute(select(SiteSetting).where(SiteSetting.key == "global_guest_limit"))
    global_limit_setting = global_limit_result.scalars().first()
    global_limit = int(global_limit_setting.value) if global_limit_setting else 3

    # Check if there is a specific guest limit for this tool
    tool_limit = tool_setting.guest_limit if tool_setting and tool_setting.guest_limit is not None else global_limit

    # Query usage count for this specific tool by this IP
    tool_usage_result = await db.execute(
        select(func.count(ToolUsage.id))
        .where(ToolUsage.ip_address == ip_address)
        .where(ToolUsage.action_type == "use")
        .where(ToolUsage.user_id == None)
        .where(ToolUsage.tool_name == tool_id) # Log must use URL path as tool_name
    )
    tool_usage_count = tool_usage_result.scalar() or 0

    if tool_usage_count >= tool_limit:
        raise HTTPException(
            status_code=403,
            detail="Guest usage limit reached for this tool. Please register to continue."
        )

    # Optional: Check total global usage across all tools (if required)
    total_usage_result = await db.execute(
        select(func.count(ToolUsage.id))
        .where(ToolUsage.ip_address == ip_address)
        .where(ToolUsage.action_type == "use")
        .where(ToolUsage.user_id == None)
    )
    total_usage_count = total_usage_result.scalar() or 0

    # We can enforce both. If total usage across all tools > global limit, block.
    if total_usage_count >= global_limit:
        raise HTTPException(
            status_code=403,
            detail="Global guest usage limit reached. Please register to continue."
        )

    yield True

    # Automatically log the execution after the request completes successfully
    try:
        new_usage = ToolUsage(
            user_id=user.id if user else None,
            ip_address=ip_address,
            tool_name=tool_id,
            action_type="use"
        )
        db.add(new_usage)
        await db.commit()
    except Exception as e:
        pass # Ignore logging errors to not affect the response
