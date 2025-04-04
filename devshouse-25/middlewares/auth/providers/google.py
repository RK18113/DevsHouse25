from authlib.integrations.httpx_client import AsyncOAuth2Client
from jose import jwt
from ..security.jwt import create_access_token
from ..utils.jwks_client import get_google_public_key
from ..config import config

async def authenticate(token: str) -> dict:
    try:
        header = jwt.get_unverified_header(token)
        public_key = await get_google_public_key(header.get("kid"))
        claims = jwt.decode(
            token,
            public_key,
            audience=config.GOOGLE_CLIENT_ID,
            algorithms=["RS256"]
        )
        return {
            "access_token": create_access_token(claims),
            "provider": "google",
            "user_id": claims["sub"],
            "email": claims["email"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google auth failed: {str(e)}"
        )
