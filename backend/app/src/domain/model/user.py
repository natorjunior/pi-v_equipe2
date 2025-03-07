from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func

from app.src.infra.database.base import Base


class User(Base):

    __tablename__ = "user"

    id = Column(Integer, primary_key = True, autoincrement = True)
    name = Column(String(100), nullable = False)
    email = Column(String(100), unique = True, nullable = False)
    password_hash = Column(String(100), nullable = False)
    avatar = Column(Text)
    created_at = Column(TIMESTAMP, server_default = func.now())