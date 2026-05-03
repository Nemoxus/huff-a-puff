from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from models.post_model import PostInDB
from auth import get_current_user
from database import users_collection, posts_collection
import cloudinary.uploader
from bson import ObjectId
import uuid
from datetime import datetime

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


@router.post("/api/posts/{post_id}/like")
async def toggle_like_post(post_id: str, current_user: str = Depends(get_current_user)):
    """Toggles a like on a post. If already liked, unlikes it."""
    
    # 1. Validate the post_id format (MongoDB crashes if the ID string isn't perfectly formatted)
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)

    # 2. Find the post in the DB
    post = await posts_collection.find_one({"_id": post_obj_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    # 3. Check if the user is already in the liked_by_users array
    # Note: We are using their username since that's what 'current_user' is
    if current_user in post.get("liked_by_users", []):
        # UNLIKE LOGIC: User is in the list, so remove them and subtract 1 from count
        await posts_collection.update_one(
            {"_id": post_obj_id},
            {
                "$pull": {"liked_by_users": current_user},
                "$inc": {"likes_count": -1}
            }
        )
        return {"message": "Post unliked", "liked": False}
    else:
        # LIKE LOGIC: User is not in the list, so add them and add 1 to count
        await posts_collection.update_one(
            {"_id": post_obj_id},
            {
                "$addToSet": {"liked_by_users": current_user},
                "$inc": {"likes_count": 1}
            }
        )
        return {"message": "Post liked", "liked": True}


@router.post("/api/posts/{post_id}/comment")
async def add_comment(
    post_id: str,
    comment_text: str = Form(...),
    current_user: str = Depends(get_current_user)
):
    """Adds a text comment to a specific post."""
    
    # 1. Validate the MongoDB ObjectId
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)

    # 2. Make sure the post actually exists
    post = await posts_collection.find_one({"_id": post_obj_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    # 3. Build the comment object
    new_comment = {
        "comment_id": str(uuid.uuid4()),               # Unique ID just for this comment
        "username": current_user,                      # The person making the comment
        "text": comment_text,                          # The actual message
        "created_at": datetime.utcnow().isoformat()    # When they posted it
    }

    # 4. Use $push to append this new comment object into the 'comments' array
    await posts_collection.update_one(
        {"_id": post_obj_id},
        {"$push": {"comments": new_comment}}
    )

    return {"message": "Comment added successfully", "comment": new_comment}