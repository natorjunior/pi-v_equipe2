from sqlalchemy import Column, DateTime, Integer, String, ForeignKey, Text, func

from app.src.infra.database.base import Base

class LikeCheckin(Base):
    
    __tablename__ = "like_checkin"
    
    id = Column(Integer, primary_key = True, autoincrement = True)
    checkin_id = Column(Integer, ForeignKey("checkin.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default = func.now())