import os
from pymongo import AsyncMongoClient
from dotenv import load_dotenv

# Load the connection string from the .env file
load_dotenv()
MONGO_URL = os.getenv("MONGODB_URL")

# Initialize the modern async client
client = AsyncMongoClient(MONGO_URL)

# Select the database (Atlas creates this automatically if it doesn't exist)
db = client["huff_a_puff_db"]

# Export the users collection for use in other parts of the app
users_collection = db["users"]