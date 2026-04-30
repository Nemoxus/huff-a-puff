# backend/app/auth.py
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from dotenv import load_dotenv

# FORCING ENV TO LOAD BEFORE GETTING KEYS
load_dotenv()

# Pull the exact same keys you used in main.py
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_if_env_missing")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# This tells FastAPI where our login route is so it can generate Swagger UI docs properly
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Validates the JWT token from the frontend.
    Returns the username if valid, blocks the request if fake/expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception