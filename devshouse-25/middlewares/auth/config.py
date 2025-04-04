from pydantic_settings import BaseSettings

class AuthConfig(BaseSettings):
    JWT_SECRET_KEY: str = "secret-key-for-dev-only"
    GOOGLE_CLIENT_ID: str = ""
    APPLE_CLIENT_ID: str = ""
    ENCRYPTION_KEY: str = "default-encryption-key-for-dev"
    TOKEN_EXPIRY_MINUTES: int = 1440  # 24 hours
    CORS_ORIGINS: str = "*"
    ALLOWED_ALGORITHMS: list = ["HS256", "RS256", "ES256"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

config = AuthConfig()
