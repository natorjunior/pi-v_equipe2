from bcrypt import checkpw, hashpw, gensalt

class EncryptionService:
    def generate_hash(self, password: str) -> str:
        return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
