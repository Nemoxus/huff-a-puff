# backend/app/main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
import os
from datetime import datetime, timedelta
from jose import jwt

# Import our custom modules
from services.ocr_service import extract_text_from_image, find_dob_and_check_age
from database import users_collection
from models.user_model import UserInDB

app = FastAPI(title="Huff-a-Puff API")

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PASSWORD HASHING SETUP ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# --- JWT CONFIGURATION ---
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_if_env_missing")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
# Default to 1440 minutes (24 hours) if not found in .env
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# --- ROUTES ---

@app.post("/api/register")
async def register_user(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    id_image: UploadFile = File(...)
):
    """
    1. Receives form data + ID Image.
    2. Runs OCR to verify 18+.
    3. Hashes password and saves to MongoDB.
    """
    
    # --- PHASE 1: PRE-CHECKS ---
    # Check if user already exists in MongoDB
    existing_user = await users_collection.find_one({"$or": [{"email": email}, {"username": username}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists.")

    if not id_image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="ID must be an image file.")

    # --- PHASE 2: OCR AGE VERIFICATION ---
    try:
        image_bytes = await id_image.read()
        extracted_text = extract_text_from_image(image_bytes)
        verification = find_dob_and_check_age(extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Processing failed: {str(e)}")

    # If OCR says they are under 18 (or couldn't find a date)
    if not verification["success"]:
        raise HTTPException(status_code=403, detail=verification["message"])

    # --- PHASE 3: DATABASE INSERTION ---
    # Hash the password
    hashed_pw = get_password_hash(password)

    # Create the user profile using our Pydantic model
    new_user_profile = UserInDB(
        username=username,
        email=email,
        hashed_password=hashed_pw,
        age=verification["age"],         # Directly from the OCR result!
        is_age_verified=True             # We know they passed the check
    )

    # Convert the Pydantic model to a Python dictionary
    user_dict = new_user_profile.model_dump()

    # Insert into MongoDB Atlas!
    result = await users_collection.insert_one(user_dict)

    # Return a success message
    return {
        "message": "Welcome to Huff-a-Puff!",
        "user_id": str(result.inserted_id),
        "username": username,
        "age_verified": verification["age"]
    }


@app.post("/api/login")
async def login_user(username: str = Form(...), password: str = Form(...)):
    """
    1. Checks if the user exists.
    2. Verifies the hashed password.
    3. Returns a JWT access token.
    """
    # 1. Find user in the database
    user = await users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # 2. Verify the password against the stored hash
    if not pwd_context.verify(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # 3. Generate the JWT Token
    access_token = create_access_token(data={"sub": user["username"]})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"],
        "message": "Login successful!"
    }