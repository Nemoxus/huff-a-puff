from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from models.post_model import PostInDB
from auth import get_current_user
from database import users_collection, posts_collection
import cloudinary.uploader
from bson import ObjectId
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.post("/api/posts")
async def create_new_post(
    title: str = Form(...),
    text_content: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    if not text_content and not image:
        raise HTTPException(status_code=400, detail="A post must contain either text, an image, or both.")

    user = await users_collection.find_one({"username": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    image_url = None
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        try:
            file_content = await image.read()
            upload_result = cloudinary.uploader.upload(file_content, folder="huff_a_puff_posts")
            image_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    new_post = PostInDB(
        author_username=current_user,
        author_id=str(user["_id"]),
        title=title,
        text_content=text_content,
        image_url=image_url
    )
    
    result = await posts_collection.insert_one(new_post.model_dump())
    
    return {"message": "Post created successfully", "post_id": str(result.inserted_id), "image_url": image_url}

@router.put("/api/posts/{post_id}")
async def edit_post(
    post_id: str,
    title: str = Form(...),
    text_content: Optional[str] = Form(None),
    current_user: str = Depends(get_current_user)
):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)
    post = await posts_collection.find_one({"_id": post_obj_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if post.get("author_username") != current_user:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this post.")
    if not text_content and not post.get("image_url"):
        raise HTTPException(status_code=400, detail="A post must contain either text, an image, or both.")

    await posts_collection.update_one(
        {"_id": post_obj_id},
        {"$set": {"title": title, "text_content": text_content, "updated_at": datetime.now(timezone.utc)}}
    )

    return {"message": "Post updated successfully"}

@router.get("/api/posts")
async def get_feed(limit: int = 20, skip: int = 0, current_user: str = Depends(get_current_user)):
    """Fetches the global chronological feed with author avatars."""
    pipeline = [
        {"$sort": {"created_at": -1}},
        {"$skip": skip},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "users",
                "localField": "author_username",
                "foreignField": "username",
                "as": "author_info"
            }
        },
        {"$unwind": {"path": "$author_info", "preserveNullAndEmptyArrays": True}}
    ]
    
    # THE FIX: Awaiting the aggregate call to resolve the coroutine crash
    cursor = await posts_collection.aggregate(pipeline)
    posts = []

    # Handle driver returning a list immediately
    if isinstance(cursor, list):
        for document in cursor:
            document["_id"] = str(document["_id"])
            author_info = document.get("author_info", {})
            document["author_profile_pic"] = author_info.get("avatar_url")
            document.pop("author_info", None)
            posts.append(document)
    else:
        # Handle async cursor
        async for document in cursor:
            document["_id"] = str(document["_id"])
            author_info = document.get("author_info", {})
            document["author_profile_pic"] = author_info.get("avatar_url")
            document.pop("author_info", None)
            posts.append(document)
            
    return {"feed": posts}


@router.post("/api/posts/{post_id}/like")
async def toggle_like_post(post_id: str, current_user: str = Depends(get_current_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)
    post = await posts_collection.find_one({"_id": post_obj_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    if current_user in post.get("liked_by_users", []):
        await posts_collection.update_one(
            {"_id": post_obj_id},
            {"$pull": {"liked_by_users": current_user}, "$inc": {"likes_count": -1}}
        )
        return {"message": "Post unliked", "liked": False}
    else:
        await posts_collection.update_one(
            {"_id": post_obj_id},
            {"$addToSet": {"liked_by_users": current_user}, "$inc": {"likes_count": 1}}
        )
        return {"message": "Post liked", "liked": True}


@router.post("/api/posts/{post_id}/comment")
async def add_comment(post_id: str, comment_text: str = Form(...), current_user: str = Depends(get_current_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)
    post = await posts_collection.find_one({"_id": post_obj_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    new_comment = {
        "comment_id": str(uuid.uuid4()),
        "username": current_user,
        "text": comment_text,
        "created_at": datetime.utcnow().isoformat()
    }

    await posts_collection.update_one(
        {"_id": post_obj_id},
        {"$push": {"comments": new_comment}}
    )

    return {"message": "Comment added successfully", "comment": new_comment}

@router.delete("/api/posts/{post_id}")
async def delete_post(post_id: str, current_user: str = Depends(get_current_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)
    post = await posts_collection.find_one({"_id": post_obj_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if post.get("author_username") != current_user:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this post.")

    await posts_collection.delete_one({"_id": post_obj_id})
    return {"message": "Post permanently deleted."}

@router.delete("/api/posts/{post_id}/comments/{comment_id}")
async def delete_comment(post_id: str, comment_id: str, current_user: str = Depends(get_current_user)):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid Post ID format.")
    
    post_obj_id = ObjectId(post_id)
    post = await posts_collection.find_one({"_id": post_obj_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    comment_to_delete = next((c for c in post.get("comments", []) if c["comment_id"] == comment_id), None)

    if not comment_to_delete:
        raise HTTPException(status_code=404, detail="Comment not found.")
    if comment_to_delete["username"] != current_user:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this comment.")
    
    await posts_collection.update_one(
        {"_id": post_obj_id},
        {"$pull": {"comments": {"comment_id": comment_id}}}
    )

    return {"message": "Comment deleted successfully"}

@router.get("/api/posts/user/{username}")
async def get_user_posts(username: str):
    """Fetches all posts created by a specific user with author avatars."""
    pipeline = [
        {"$match": {"author_username": username}},
        {"$sort": {"created_at": -1}},
        {
            "$lookup": {
                "from": "users",
                "localField": "author_username",
                "foreignField": "username",
                "as": "author_info"
            }
        },
        {"$unwind": {"path": "$author_info", "preserveNullAndEmptyArrays": True}}
    ]
    
    # THE FIX: Bulletproof iteration for specific user posts too
    cursor = await posts_collection.aggregate(pipeline)
    posts = []
    
    if isinstance(cursor, list):
        for document in cursor:
            document["_id"] = str(document["_id"])
            author_info = document.get("author_info", {})
            document["author_profile_pic"] = author_info.get("avatar_url")
            document.pop("author_info", None)
            posts.append(document)
    else:
        async for document in cursor:
            document["_id"] = str(document["_id"])
            author_info = document.get("author_info", {})
            document["author_profile_pic"] = author_info.get("avatar_url")
            document.pop("author_info", None)
            posts.append(document)
            
    return {"feed": posts}