from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "DreamConsole API"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "123"
    MYSQL_SERVER: str = "localhost"
    MYSQL_PORT: str = "3306"
    MYSQL_DB: str = "dcdl"
    
    @property
    def DATABASE_URI(self) -> str:
        return f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_SERVER}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
