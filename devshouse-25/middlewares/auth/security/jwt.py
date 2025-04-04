from jose import jwt, JWTError
from datetime import datetime, timedelta
from ..config import config

def create_access_token(data: dict) -> str:
    expires = datetime.utcnow() + timedelta(minutes=config.TOKEN_EXPIRY_MINUTES)
    return jwt.encode(
        {**data, "exp": expires},
        config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            config.JWT_SECRET_KEY,
            algorithms=[config.ALLOWED_ALGORITHMS[0]]
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
