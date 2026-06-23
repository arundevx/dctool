from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional

from app.db.database import get_db
from app.db.models import User, ToolUsage, SiteSetting, ToolSetting
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])

# --- SETTINGS ---

class SettingsUpdate(BaseModel):
    registration_enabled: bool
    global_guest_limit: int

@router.get("/settings")
async def get_settings(db: AsyncSession = Depends(get_db)):
    settings_result = await db.execute(select(SiteSetting))
    settings_records = settings_result.scalars().all()
    
    settings_dict = {s.key: s.value for s in settings_records}
    
    return {
        "registration_enabled": settings_dict.get("registration_enabled", "true") == "true",
        "global_guest_limit": int(settings_dict.get("global_guest_limit", 3))
    }

@router.put("/settings")
async def update_settings(data: SettingsUpdate, db: AsyncSession = Depends(get_db)):
    settings_to_update = {
        "registration_enabled": str(data.registration_enabled).lower(),
        "global_guest_limit": str(data.global_guest_limit)
    }
    
    for key, value in settings_to_update.items():
        result = await db.execute(select(SiteSetting).where(SiteSetting.key == key))
        setting = result.scalars().first()
        if setting:
            setting.value = value
        else:
            setting = SiteSetting(key=key, value=value)
            db.add(setting)
            
    await db.commit()
    return {"status": "success"}

# --- TOOLS ---

class ToolUpdate(BaseModel):
    is_enabled: bool
    guest_limit: Optional[int] = None

@router.get("/tools")
async def get_all_tools(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ToolSetting))
    return result.scalars().all()

@router.put("/tools/{tool_id:path}")
async def update_tool(tool_id: str, data: ToolUpdate, db: AsyncSession = Depends(get_db)):
    # tool_id might come in with leading slash missing if not careful, but path param handles it
    if not tool_id.startswith("/"):
        tool_id = "/" + tool_id
        
    result = await db.execute(select(ToolSetting).where(ToolSetting.tool_id == tool_id))
    tool = result.scalars().first()
    
    if tool:
        tool.is_enabled = data.is_enabled
        tool.guest_limit = data.guest_limit
    else:
        tool = ToolSetting(
            tool_id=tool_id,
            is_enabled=data.is_enabled,
            guest_limit=data.guest_limit
        )
        db.add(tool)
        
    await db.commit()
    return tool

# --- STATS ---

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Total Users
    users_result = await db.execute(select(func.count(User.id)))
    total_users = users_result.scalar() or 0
    
    # Total Usages
    usages_result = await db.execute(select(func.count(ToolUsage.id)).where(ToolUsage.action_type == "use"))
    total_usages = usages_result.scalar() or 0
    
    # Top Tools (Group by tool_name, order by count)
    top_tools_query = (
        select(ToolUsage.tool_name, func.count(ToolUsage.id).label("count"))
        .where(ToolUsage.action_type == "use")
        .group_by(ToolUsage.tool_name)
        .order_by(func.count(ToolUsage.id).desc())
        .limit(10)
    )
    top_tools_result = await db.execute(top_tools_query)
    top_tools = [{"tool_id": row.tool_name, "count": row.count} for row in top_tools_result]
    
    return {
        "total_users": total_users,
        "total_usages": total_usages,
        "top_tools": top_tools
    }
