from fastapi import FastAPI, Depends, APIRouter, HTTPException, Depends, Body
from app.auth.auth import auth_router, get_current_user
from app.schemas.models import PredictInput, Profile, Asset, Watchlist, GraphData, Settings
import pickle, numpy as np
from app.db.connect import users_collection
from typing import Optional, List
from google import genai
from prompt_guidelin import system_prompt
import re

app = FastAPI()

app.include_router(auth_router)

client = genai.Client(api_key="AIzaSyAjdTYIsxh5lvHFMHxL_TmDcjX3LuFxQ3I")

# Load the model once
# with open("app/model/model.pkl", "rb") as f:
#     model = pickle.load(f)

# @app.post("/predict")
# def predict(input_data: PredictInput, current_user: str = Depends(get_current_user)):
#     input_array = np.array([[input_data.feature1, input_data.feature2, input_data.feature3]])
#     prediction = model.predict(input_array)
#     return {"prediction": prediction[0]}

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock AI API!"}

# @app.post("/predict")
# def predict(input_data: PredictInput, current_user: str = Depends(get_current_user)):
#     input_array = np.array([[input_data.feature1, input_data.feature2, input_data.feature3]])
#     prediction = model.predict(input_array)
#     return {"prediction": prediction[0]}


def validate_input(query: str) -> bool:
    # Length check
    if len(query) > 200:
        return False

    # Keyword denylist
    prohibited_terms = ["crypto", "nft", "personal", "hypothetical"]
    if any(term in query.lower() for term in prohibited_terms):
        return False

    # Stock-specific allowlist
    stock_keywords = ["stock", "share", "nyse", "nasdaq", "dividend"]
    if not any(kw in query.lower() for kw in stock_keywords):
        return False

    # Programming syntax blocklist (Python, JS, C/C++, Java, etc.)
    programming_patterns = [
        r"\bdef\b", r"\bclass\b", r"\bimport\b", r"\bfunction\b", r"\bconsole\.log\b",
        r"\bvar\b", r"\blet\b", r"\bconst\b", r"\bif\s*\(", r"\bwhile\s*\(",
        r"\bfor\s*\(", r"try\s*{", r"catch\s*\(", r"#include\s*<", r"\bpublic\b",
        r"\bprivate\b", r"\bstatic\b", r"\bSystem\.out\.println\b", r"<script.*?>",
        r"{.*?}", r"\[.*?\]", r"\(.*?\)", r"==|!=|>=|<=|=>|<-|->|::",  # common logic/syntax
    ]
    for pattern in programming_patterns:
        if re.search(pattern, query, re.IGNORECASE):
            return False

    # Injection/XSS patterns
    injection_patterns = [
        r"(?:--|\|\||;)",  # SQL chaining
        r"(?:select|drop|insert|delete|update|union)",  # SQL keywords
        r"(?:\bOR\b|\bAND\b).+=.",  # conditional logic
        r"<[^>]+>",  # HTML tags
        r"(?:\$\{.+\})",  # Template injections
    ]
    for pattern in injection_patterns:
        if re.search(pattern, query, re.IGNORECASE):
            return False

    # Block external links that are NOT stock/company/news related
    if "http" in query.lower() or "www." in query.lower():
        allowed_domains = ["bloomberg", "reuters", "yahoo finance", "marketwatch", "moneycontrol", "investopedia"]
        if not any(domain in query.lower() for domain in allowed_domains):
            return False

    return True


@app.post("/chat")
def call_gemini_api(prompt: str = Body(...)):
    if not validate_input(prompt):
        raise HTTPException(status_code=400, detail="Invalid input")
    
    # Append the validated prompt to the system prompt
    full_prompt = f"{system_prompt}\n{prompt}"
    
    # Call the Gemini API
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=full_prompt
    )
    return {"response": response.text}

@app.post("/profile")
def update_profile(profile: Profile, current_user: str = Depends(get_current_user)):
    # Ensure a single document exists for the user
    users_collection.update_one(
        {"username": current_user},
        {"$setOnInsert": {"username": current_user}},  # Create the document if it doesn't exist
        upsert=True
    )
    # Update the profile field
    users_collection.update_one(
        {"username": current_user},
        {"$set": {"profile": profile.dict()}}
    )
    return {"message": "Profile updated"}

@app.get("/profile", response_model=Profile)
def get_profile(current_user: str = Depends(get_current_user)):
    user_doc = users_collection.find_one({"username": current_user})
    if not user_doc or "profile" not in user_doc:
        raise HTTPException(status_code=404, detail="Profile not found")
    return user_doc["profile"]


@app.get("/assets", response_model=List[Asset])
def get_assets(current_user: str = Depends(get_current_user)):
    user = users_collection.find_one({"username": current_user})
    return user.get("assets", [])


@app.post("/assets")
def add_asset(asset: Asset, current_user: str = Depends(get_current_user)):
    # Ensure a single document exists for the user
    users_collection.update_one(
        {"username": current_user},
        {"$setOnInsert": {"username": current_user}},  # Create the document if it doesn't exist
        upsert=True
    )
    # Add the asset to the assets array
    users_collection.update_one(
        {"username": current_user},
        {"$push": {"assets": asset.dict()}}
    )
    return {"message": "Asset added"}


@app.get("/watchlist", response_model=Watchlist)
def get_watchlist(current_user: str = Depends(get_current_user)):
    user = users_collection.find_one({"username": current_user})
    if not user or "watchlist" not in user:
        raise HTTPException(status_code=404, detail="Watchlist not found")
    return user["watchlist"]


@app.post("/watchlist")
def add_to_watchlist(item: Watchlist, current_user: str = Depends(get_current_user)):
    # Ensure a single document exists for the user
    users_collection.update_one(
        {"username": current_user},
        {"$setOnInsert": {"username": current_user}},  # Create the document if it doesn't exist
        upsert=True
    )
    # Update the watchlist field
    users_collection.update_one(
        {"username": current_user},
        {"$set": {"watchlist": item.dict()}}
    )
    return {"message": "Watchlist updated"}


@app.get("/graph", response_model=GraphData)
def get_graph_data(current_user: str = Depends(get_current_user)):
    user = users_collection.find_one({"username": current_user})
    if not user or "graph" not in user:
        raise HTTPException(status_code=404, detail="Graph data not found")
    return user["graph"]


@app.post("/settings")
def update_settings(settings: Settings, current_user: str = Depends(get_current_user)):
    # Ensure a single document exists for the user
    users_collection.update_one(
        {"username": current_user},
        {"$setOnInsert": {"username": current_user}},  # Create the document if it doesn't exist
        upsert=True
    )
    # Update the settings field
    users_collection.update_one(
        {"username": current_user},
        {"$set": {"settings": settings.dict()}}
    )
    return {"message": "Settings updated"}


@app.post("/settings")
def update_settings(settings: Settings, current_user: str = Depends(get_current_user)):
    users_collection.update_one(
        {"username": current_user},
        {"$set": {"settings": settings.dict()}},
        upsert=True
    )
    return {"message": "Settings updated"}

