import httpx
import json
import time
from ..config import config

jwks_cache = {
    "google": {"keys": None, "expiry": 0},
    "apple": {"keys": None, "expiry": 0}
}

async def get_google_public_key(kid: str) -> str:
    return await _get_key("google", kid, "https://www.googleapis.com/oauth2/v3/certs")

async def get_apple_public_key(kid: str) -> str:
    keys = await _get_keys("apple", "https://appleid.apple.com/auth/keys")
    for key in keys:
        if key["kid"] == kid:
            return serialize_apple_key(key)
    raise ValueError("Apple public key not found")

async def _get_keys(provider: str, url: str) -> list:
    if jwks_cache[provider]["keys"] and jwks_cache[provider]["expiry"] > time.time():
        return jwks_cache[provider]["keys"]
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        jwks = response.json()
        jwks_cache[provider] = {
            "keys": jwks["keys"],
            "expiry": time.time() + 3600
        }
        return jwks["keys"]

def serialize_apple_key(key: dict) -> str:
    public_key = ec.EllipticCurvePublicKey.from_encoded_point(
        ec.SECP256R1(),
        bytes.fromhex(key["x"]) + bytes.fromhex(key["y"])
    )
    return public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
