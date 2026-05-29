from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from auth import get_current_user
from database import users_collection
import cloudinary.uploader
from datetime import datetime
from zoneinfo import ZoneInfo

router = APIRouter()

@router.put("/api/profile")
async def update_profile(
    display_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    interests: Optional[str] = Form(None), 
    avatar: Optional[UploadFile] = File(None),
    banner_pic: Optional[UploadFile] = File(None),
    current_user: str = Depends(get_current_user)
):
    """Updates the user's profile information and handles avatar/banner uploads."""
    
    # 1. Verify user exists
    user = await users_collection.find_one({"username": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Prepare the data dictionary for MongoDB
    update_data = {}
    
    if display_name is not None:
        update_data["display_name"] = display_name
    if bio is not None:
        update_data["bio"] = bio
        
    if interests is not None:
        update_data["interests"] = [i.strip() for i in interests.split(",") if i.strip()]

    # 3. Helper function for Cloudinary uploads
    async def upload_image(file_obj: UploadFile, folder_name: str) -> str:
        if not file_obj.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        try:
            file_content = await file_obj.read()
            upload_result = cloudinary.uploader.upload(file_content, folder=folder_name)
            return upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    # 4. Handle File Uploads
    if avatar:
        update_data["avatar_url"] = await upload_image(avatar, "huff_a_puff_profiles")
    
    if banner_pic:
        update_data["banner_pic_url"] = await upload_image(banner_pic, "huff_a_puff_banners")

    if not update_data:
        return {"message": "No new data provided to update."}

    update_data["updated_at"] = datetime.now(ZoneInfo("Asia/Kolkata"))

    # 5. Update MongoDB
    await users_collection.update_one(
        {"username": current_user},
        {"$set": update_data}
    )

    return {
        "message": "Profile updated successfully", 
        "updated_fields": list(update_data.keys())
    }