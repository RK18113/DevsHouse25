from fastapi import Request, HTTPException, status
from fastapi.middleware.base import BaseHTTPMiddleware
from .security.jwt import verify_token
from .providers import google, apple, email
from .config import config

class UniversalAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, public_paths: list = []):
        super().__init__(app)
        self.public_paths = public_paths

    async def dispatch(self, request: Request, call_next):
        if self._is_public_path(request):
            return await call_next(request)
            
        try:
            auth_header = request.headers.get("Authorization", "")
            user_data = await self._authenticate(auth_header)
            request.state.user = user_data
        except HTTPException as e:
            return e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e)
            )
            
        return await call_next(request)

    def _is_public_path(self, request: Request) -> bool:
        return any(request.url.path.startswith(p) for p in self.public_paths)

    async def _authenticate(self, auth_header: str) -> dict:
        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authorization header"
            )
            
        scheme, _, token = auth_header.partition(" ")
        scheme = scheme.lower()
        
        if scheme == "bearer":
            return verify_token(token)
        elif scheme == "google":
            return await google.authenticate(token)
        elif scheme == "apple":
            return await apple.authenticate(token)
        elif scheme == "email":
            return email.authenticate(token)
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )
