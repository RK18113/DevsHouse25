from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.db.connect import users_collection
from app.auth.jwt_handler import create_access_token, decode_access_token
from passlib.context import CryptContext

auth_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_user(email: str):
    return users_collection.find_one({"email": email})

@auth_router.post("/signup")
def signup(email: str, password: str):
    # Check if a user with the given email already exists
    if get_user(email):
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Hash the password
    hashed_password = pwd_context.hash(password)
    
    # Insert a single document with both email and username fields
    users_collection.insert_one({
        "email": email,
        "username": email,  # Use email as the username
        "password": hashed_password,
        "profile": {},      # Initialize profile as an empty object
        "assets": [],       # Initialize assets as an empty list
        "watchlist": {},    # Initialize watchlist as an empty object
        "settings": {}      # Initialize settings as an empty object
    })
    return {"message": "User created successfully"}

@auth_router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or not get_user(payload.get("sub")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return payload.get("sub")
