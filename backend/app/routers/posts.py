from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from models.post_model import PostInDB
from auth import get_current_user
from database import users_collection, posts_collection
import cloudinary.uploader

router = APIRouter()

@router.post("/api/posts")
async def create_new_post(
    title: str = Form(...),                        # Mandatory
    text_content: Optional[str] = Form(None),      # Optional
    image: Optional[UploadFile] = File(None),      # Optional
    current_user: str = Depends(get_current_user)  # Security Check
):
    """Creates a post and uploads images directly to Cloudinary."""
    
    # 1. Enforce the rules: Must have title AND at least text or image
    if not text_content and not image:
        raise HTTPException(
            status_code=400, 
            detail="A post must contain either text, an image, or both."
        )

    # 2. Look up the author
    user = await users_collection.find_one({"username": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Handle Cloudinary Image Upload
    image_url = None
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        
        try:
            # Read the file from the request
            file_content = await image.read()
            
            # Upload directly to your Cloudinary account
            upload_result = cloudinary.uploader.upload(
                file_content, 
                folder="huff_a_puff_posts" 
            )
            
            # Extract the permanent HTTPS URL
            image_url = upload_result.get("secure_url")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # 4. Build the database object using the Pydantic model
    new_post = PostInDB(
        author_username=current_user,
        author_id=str(user["_id"]),
        title=title,
        text_content=text_content,
        image_url=image_url
    )
    
    # 5. Save to MongoDB
    result = await posts_collection.insert_one(new_post.model_dump())
    
    return {
        "message": "Post created successfully", 
        "post_id": str(result.inserted_id), 
        "image_url": image_url
    }


@router.get("/api/posts")
async def get_feed(limit: int = 20, skip: int = 0, current_user: str = Depends(get_current_user)):
    """Fetches the global chronological feed."""
    
    # Sort by created_at descending (-1) to get the newest posts first
    cursor = posts_collection.find().sort("created_at", -1).skip(skip).limit(limit)
    
    posts = []
    async for document in cursor:
        document["_id"] = str(document["_id"]) 
        posts.append(document)
        
    return {"feed": posts}