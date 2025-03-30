from sqlalchemy import insert
from sqlalchemy.orm import Session

from app.src.domain.model.group import Group


class GroupRepository:

    def __init__(self, session: Session):
        self.session = session

    def get_group_by_id(self, group_id: int):
        return self.session.query(Group).filter(Group.id == group_id).first()

    def get_by_multiple_id(self, group_ids):
        return self.session.query(Group).filter(Group.id.in_(group_ids)).all()

    def get_group_by_alias(self, group_alias):
        return self.session.query(Group).filter(Group.group_alias == group_alias).first()

    def create_group(self,group_alias, group_name, description, user_id):
        try:
            stmt = insert(Group).values(
                group_alias=group_alias,
                group_name=group_name,
                description=description,
                created_by=user_id
            )

            result = self.session.execute(stmt)
            self.session.commit()

            group_id = result.lastrowid

            return self.get_group_by_id(group_id)

        except Exception as e:
            self.session.rollback()
            raise e

    def delete_group(self, group_id):
        group = self.session.query(Group).filter(Group.id == group_id).first()
        if not group:
            return False
        self.session.delete(group)
        self.session.commit()
        return True
