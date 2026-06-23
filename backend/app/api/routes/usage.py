from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import ToolUsage, User
from app.api.deps import get_current_user_optional

router = APIRouter(prefix="/usage", tags=["usage"])

class UsageLog(BaseModel):
    tool_name: str
    action_type: str # "view" or "use"

@router.post("/log")
async def log_usage(
    request: Request,
    data: UsageLog,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional)
):
    ip_address = request.client.host if request.client else "unknown"
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()

    usage = ToolUsage(
        user_id=user.id if user else None,
        ip_address=ip_address,
        tool_name=data.tool_name,
        action_type=data.action_type
    )
    db.add(usage)
    await db.commit()
    return {"status": "logged"}
