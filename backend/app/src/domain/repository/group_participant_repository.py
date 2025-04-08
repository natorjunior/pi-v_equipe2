from sqlalchemy.orm import Session

from app.src.domain.model.group_participant import GroupParticipant


class GroupParticipantRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_all_by_user_id(self, user_id):
        return self.session.query(GroupParticipant).filter_by(user_id=user_id).all()

    def get_all_by_group_id(self, group_id):
        return self.session.query(GroupParticipant).filter_by(group_id=group_id).all()


    def add_participant(self, user_id: int, group_id: int):
        try:
            new_participant = GroupParticipant(group_id=group_id, user_id=user_id)
            self.session.add(new_participant)
            self.session.commit()

        except Exception as e:
            self.session.rollback()
            raise e

    def remove_participant(self, user_id, group_id):
        participant = (self.session.query(GroupParticipant)
                        .filter(GroupParticipant.user_id == user_id,
                                GroupParticipant.group_id == group_id)
                        .first())

        if not participant:
            return False

        self.session.delete(participant)
        self.session.commit()
        return True

    def remove_all_participants(self, group_id):
        participants = self.get_all_by_group_id(group_id)
        if not participants:
            return False

        for participant in participants:
            self.session.delete(participant)

        self.session.commit()
        return True