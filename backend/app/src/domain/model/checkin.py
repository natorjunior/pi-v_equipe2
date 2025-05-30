from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Text, func

from app.src.infra.database.base import Base


class Checkin(Base):

    __tablename__ = "checkin"

    id = Column(Integer, primary_key = True, autoincrement = True)
    group_id = Column(Integer, ForeignKey("group.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable = False)
    description = Column(Text)
    photo = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default = func.now())
    updated_at = Column(DateTime(timezone=True), server_default = func.now(), onupdate=func.current_timestamp())
