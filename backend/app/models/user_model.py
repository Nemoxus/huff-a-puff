from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

class CreateUser(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=12)


class UserInDB(BaseModel):
    username: str
    email: str
    hashed_password: str
    age: int
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("Asia/Kolkata")))    