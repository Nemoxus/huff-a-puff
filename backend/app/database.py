import os
from pymongo import AsyncMongoClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

# --- MONGODB SETUP ---
MONGO_URL = os.getenv("MONGODB_URL")
client = AsyncMongoClient(MONGO_URL)
db = client["huff_a_puff_db"]
users_collection = db["users"]
posts_collection = db["posts"]

# --- CLOUDINARY SETUP ---
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)