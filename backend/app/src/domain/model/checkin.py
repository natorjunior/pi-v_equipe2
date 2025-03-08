from sqlalchemy import Column, Integer, String, ForeignKey, Text, TIMESTAMP, func

from app.src.infra.database.base import Base


class Checkin(Base):

    __tablename__ = "checkin"

    id = Column(Integer, primary_key = True, autoincrement = True)
    group_id = Column(Integer, ForeignKey("group.id"), nullable = False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable = False)
    title = Column(String(255), nullable = False)
    description = Column(Text)
    photo = Column(Text)
    created_at = Column(TIMESTAMP, server_default = func.now())
    updated_at = Column(TIMESTAMP, server_default = func.now())
