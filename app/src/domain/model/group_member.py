from sqlalchemy import Column, ForeignKey, Integer, TIMESTAMP, func

from app.src.infra.database.base import Base


class GroupParticipant(Base):

    __tablename__ = "group_participant"

    id = Column(Integer, primary_key = True, autoincrement = True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable = False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable = False)
    entry_date = Column(TIMESTAMP, server_default = func.now())