from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from models.post_model import PostInDB
from auth import get_current_user
from database import users_collection, posts_collection
import uuid

router = APIRouter()

@router.post("/api/posts")
async def create_new_post(
    title: str = Form(...),                        # Mandatory
    text_content: Optional[str] = Form(None),      # Optional
    image: Optional[UploadFile] = File(None),      # Optional
    current_user: str = Depends(get_current_user)  # Security Check
):
    """Creates a new post safely."""
    
    # 1. Enforce the rules: Must have title (enforced above) AND at least text or image
    if not text_content and not image:
        raise HTTPException(
            status_code=400, 
            detail="A post must contain either text, an image, or both."
        )

    # 2. Look up the author
    user = await users_collection.find_one({"username": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Handle Image Upload (Mocking the URL for now)
    image_url = None
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        
        # In a production app, you'd save this to AWS S3 or a local static folder.
        # For now, we will generate a fake URL to store in the DB.
        image_url = f"/uploads/posts/{uuid.uuid4()}_{image.filename}"

    # 4. Build the database object
    new_post = PostInDB(
        author_username=current_user,
        author_id=str(user["_id"]),
        title=title,
        text_content=text_content,
        image_url=image_url
    )
    
    # 5. Save to MongoDB
    result = await posts_collection.insert_one(new_post.model_dump())
    
    return {"message": "Post created successfully", "post_id": str(result.inserted_id)}


@router.get("/api/posts")
async def get_feed(limit: int = 20, skip: int = 0, current_user: str = Depends(get_current_user)):
    """Fetches the global chronological feed."""
    
    cursor = posts_collection.find().sort("created_at", -1).skip(skip).limit(limit)
    
    posts = []
    async for document in cursor:
        document["_id"] = str(document["_id"]) 
        posts.append(document)
        
    return {"feed": posts}