from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
from typing import Union, Dict, Any
from ..config import config

class EncryptionService:
    def __init__(self):
        self.fernet = self._initialize_fernet()

    def _initialize_fernet(self) -> Fernet:
        """Initialize Fernet with environment key or generate new key"""
        encryption_key = config.ENCRYPTION_KEY.encode()
        
        if not encryption_key:
            raise ValueError("ENCRYPTION_KEY environment variable not set")
            
        # Validate key format
        try:
            return Fernet(encryption_key)
        except ValueError:
            raise ValueError("Invalid Fernet key format. Must be 32 url-safe base64-encoded bytes.")

    @staticmethod
    def generate_key() -> str:
        """Generate a new Fernet key"""
        return Fernet.generate_key().decode()

    def encrypt_data(self, data: Union[str, Dict[str, Any]]) -> str:
        """Encrypt sensitive data (supports strings and dictionaries)"""
        try:
            if isinstance(data, dict):
                data = json.dumps(data)
            return self.fernet.encrypt(data.encode()).decode()
        except Exception as e:
            raise ValueError(f"Encryption failed: {str(e)}")

    def decrypt_data(self, encrypted_data: str) -> Union[str, Dict[str, Any]]:
        """Decrypt data and auto-detect JSON format"""
        try:
            decrypted = self.fernet.decrypt(encrypted_data.encode()).decode()
            try:
                return json.loads(decrypted)
            except json.JSONDecodeError:
                return decrypted
        except InvalidToken:
            raise ValueError("Invalid encryption token - possible tampering detected")
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

    def create_derived_key(self, password: str, salt: bytes = None) -> str:
        """Create a key derived from a password (for user-specific encryption)"""
        salt = salt or os.urandom(16)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=480000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return Fernet(key), salt

# Singleton instance for easy dependency injection
encryption_service = EncryptionService()
