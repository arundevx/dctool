from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SUBSCRIBER = "subscriber"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    usages = relationship("ToolUsage", back_populates="user")

class ToolUsage(Base):
    __tablename__ = "tool_usages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(50), nullable=True, index=True)
    tool_name = Column(String(100), nullable=False)
    action_type = Column(String(50), nullable=False) # e.g. "view", "use"
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="usages")

class SiteSetting(Base):
    __tablename__ = "site_settings"
    
    key = Column(String(100), primary_key=True, index=True)
    value = Column(String(255), nullable=False)

class ToolSetting(Base):
    __tablename__ = "tool_settings"
    
    tool_id = Column(String(255), primary_key=True, index=True)
    is_enabled = Column(Boolean, default=True, nullable=False)
    guest_limit = Column(Integer, nullable=True) # Null means fallback to global limit
