from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "stockAI"

client = MongoClient(MONGO_URI)
database = client[DB_NAME]
users_collection = database["sus"]

try:
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB!")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")