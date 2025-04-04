from jose import jwt
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from ..utils.jwks_client import get_apple_public_key
from ..config import config

async def authenticate(token: str) -> dict:
    try:
        header = jwt.get_unverified_header(token)
        public_key = await get_apple_public_key(header.get("kid"))
        claims = jwt.decode(
            token,
            public_key,
            audience=config.APPLE_CLIENT_ID,
            algorithms=["ES256"]
        )
        return {
            "access_token": create_access_token(claims),
            "provider": "apple",
            "user_id": claims["sub"],
            "email": claims.get("email", "")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Apple auth failed: {str(e)}"
        )
