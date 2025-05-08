from sqlalchemy.orm import Session

from app.src.domain.dto.checkin_dto import CheckinUpdate
from app.src.domain.model.checkin import Checkin
from app.src.domain.model.user import User
from sqlalchemy import func


class CheckinRepository:
    def __init__(self, session:Session):
        self.session =session

    
    def get_checkin_by_id(self, checkin_id):
        return self.session.query(Checkin).filter(Checkin.id == checkin_id).first()

    def get_checkin_by_group_id(self, group_id):
        return self.session.query(Checkin).filter(Checkin.group_id == group_id).all()
    
    def get_checkin_by_user_id(self, user_id):
        return self.session.query(Checkin).filter(Checkin.user_id == user_id).all()

    def create_checkin(self, group_id, user_id, title, description, photo):
        new_checkin = Checkin(
            group_id=group_id,
            user_id=user_id,
            title=title,
            description=description,
            photo=photo
        )
        self.session.add(new_checkin)
        self.session.commit()
        self.session.refresh(new_checkin)
        return new_checkin

    def update_checkin(self, checkin_changes: CheckinUpdate, photo):
        checkin = self.session.query(Checkin).filter(Checkin.id == checkin_changes.checkin_id).first()
        if not checkin:
            return None

        if photo:
            checkin.photo = photo

        if checkin_changes.title:
            checkin.title = checkin_changes.title

        if checkin_changes.description:
            checkin.description = checkin_changes.description

        self.session.commit()
        self.session.refresh(checkin)
        return checkin

    def delete_checkin(self, checkin_id):
        checkin = self.session.query(Checkin).filter(Checkin.id == checkin_id).first()
        if not checkin:
            return False
        self.session.delete(checkin)
        self.session.commit()
        return True
    
    def get_ranking_by_group_id(self, group_id: int):
        return (
            self.session.query(
                Checkin.user_id,
                func.count(Checkin.id).label("checkin_count"),
                User.name
            )
            .join(User, User.id == Checkin.user_id)
            .filter(Checkin.group_id == group_id)
            .group_by(Checkin.user_id, User.name)
            .order_by(func.count(Checkin.id).desc())
            .all()
        )