from authlib.integrations.httpx_client import AsyncOAuth2Client
from ..config import config

def get_google_oauth_client() -> AsyncOAuth2Client:
    """
    Create and return an OAuth2 client for Google authentication.
    """
    return AsyncOAuth2Client(
        client_id=config.GOOGLE_CLIENT_ID,
        client_secret=None,  # No client secret required for ID token verification
        scope="openid email profile",
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration"
    )

def get_apple_oauth_client() -> AsyncOAuth2Client:
    """
    Create and return an OAuth2 client for Apple authentication.
    """
    return AsyncOAuth2Client(
        client_id=config.APPLE_CLIENT_ID,
        client_secret=None,  # Apple uses JWT-based client secrets
        scope="name email",
        server_metadata_url="https://appleid.apple.com/.well-known/openid-configuration"
    )
