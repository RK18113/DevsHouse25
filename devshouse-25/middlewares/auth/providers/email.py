from passlib.context import CryptContext
from fastapi import HTTPException, status, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime, timedelta
from ..security.jwt import create_access_token
from ..config import config

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Email configuration for FastMail
mail_config = ConnectionConfig(
    MAIL_USERNAME=config.MAIL_USERNAME,
    MAIL_PASSWORD=config.MAIL_PASSWORD,
    MAIL_FROM=config.MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True
)

# URL serializer for email verification tokens
serializer = URLSafeTimedSerializer(config.JWT_SECRET_KEY)

# Mock database (replace with actual database logic)
mock_db = {
    "users": []  # Store user data as dictionaries (e.g., {"email": ..., "password": ..., "is_verified": ...})
}

async def register_user(email: str, password: str, name: str, background_tasks: BackgroundTasks):
    """Register a new user."""
    # Check if the email is already registered
    if any(user["email"] == email for user in mock_db["users"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    # Hash the password
    hashed_password = pwd_context.hash(password)

    # Create a new user entry in the database (mocked here)
    user = {
        "email": email,
        "password": hashed_password,
        "name": name,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    mock_db["users"].append(user)

    # Generate an email verification token
    token = serializer.dumps(email)

    # Send verification email
    await send_verification_email(email, token, background_tasks)

    return {"message": "User registered successfully. Please check your email to verify your account."}

async def send_verification_email(email: str, token: str, background_tasks: BackgroundTasks):
    """Send an email verification link."""
    verification_url = f"http://localhost:8000/auth/verify-email?token={token}"
    
    message = MessageSchema(
        subject="Verify Your Account",
        recipients=[email],
        body=f"""
        Hi there,

        Thank you for registering! Please verify your account by clicking the link below:

        {verification_url}

        This link will expire in 24 hours.

        Best regards,
        Stock AI Advisor Team
        """,
        subtype="plain"
    )
    
    fm = FastMail(mail_config)
    background_tasks.add_task(fm.send_message, message)

async def verify_email(token: str):
    """Verify a user's email using the token."""
    try:
        email = serializer.loads(token, max_age=86400)  # Token expires after 24 hours

        # Find the user in the database and mark as verified (mocked here)
        for user in mock_db["users"]:
            if user["email"] == email:
                user["is_verified"] = True
                return {"message": "Email verified successfully."}
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or expired token: {str(e)}"
        )

async def login_user(email: str, password: str):
    """Authenticate a user and return a JWT token."""
    # Find the user in the database (mocked here)
    user = next((u for u in mock_db["users"] if u["email"] == email), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if not pwd_context.verify(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    if not user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not verified. Please check your inbox."
        )

    # Generate a JWT token for the authenticated user
    access_token = create_access_token({"sub": user["email"], "name": user["name"]})
    
    return {"access_token": access_token, "token_type": "bearer"}
