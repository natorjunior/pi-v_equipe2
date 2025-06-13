from sqlalchemy.orm import Session

from app.src.domain.model.like_checkin import LikeCheckin

class LikeRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_like_for_checkin(self, checkin_id: int):
        return self.session.query(LikeCheckin).filter(LikeCheckin.checkin_id == checkin_id).all()
    
    def count_likes_for_checkin(self, checkin_id: int) -> int:
        return self.session.query(LikeCheckin).filter(LikeCheckin.checkin_id == checkin_id).count()

    def has_user_liked(self, user_id: int, checkin_id: int):
        return self.session.query(LikeCheckin).filter_by(user_id=user_id, checkin_id=checkin_id).first() is not None

    def like_checkin(self, user_id, checkin_id):
        new_like = LikeCheckin(user_id=user_id, checkin_id=checkin_id)
        self.session.add(new_like)
        self.session.commit()
        self.session.refresh(new_like)
        return new_like

    def unlike_checkin(self, user_id, checkin_id):
        like = self.session.query(LikeCheckin).filter_by(user_id=user_id, checkin_id=checkin_id).first()
        if like:
            self.session.delete(like)
            self.session.commit()