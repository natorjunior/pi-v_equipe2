from sqlalchemy import Column, ForeignKey, Integer, String, Text, TIMESTAMP, func

from app.src.infra.database.base import Base


class Group(Base):

    __tablename__ = "group"

    id = Column(Integer, primary_key = True, autoincrement = True)
    group_alias = Column(String(100), unique=True, nullable=False)
    group_name = Column(String(100), nullable = False)
    description = Column(Text)
    created_by = Column(Integer, ForeignKey("user.id"), nullable = False)
    created_at = Column(TIMESTAMP, server_default = func.now())