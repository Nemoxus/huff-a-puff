from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone

class CreatePost(BaseModel):
    """What the user sends from the frontend when making a post."""
    content: str = Field(..., max_length=1000, description="The main text of the post")
    # We will handle image uploads as a separate form-data field if needed, 
    # but let's keep text as the core for now.

class PostInDB(BaseModel):
    """How the post is actually stored in MongoDB."""
    author_username: str
    author_id: str
    title: str                                     # MANDATORY
    text_content: Optional[str] = None             # OPTIONAL
    image_url: Optional[str] = None                # OPTIONAL
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None          # OPTIONAL
    likes_count: int = 0
    liked_by_users: List[str] = []