from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette import status

from app.src.domain.dto.group_wrapper import GroupWrapper
from app.src.domain.dto.new_group import NewGroup
from app.src.domain.repository.group_participant_repository import GroupParticipantRepository
from app.src.domain.repository.group_repository import GroupRepository
from app.src.domain.service.user_service import UserService


class GroupService:

    def __init__(self, session:Session):
        self.group_participant_repository = GroupParticipantRepository(session)
        self.group_repository = GroupRepository(session)
        self.user_service = UserService(session)


    def get_group_by_user_id(self, user_id):

        group_ids = []
        group_wrapper_list =[]
        group_participant_map = {}

        group_participant = self.group_participant_repository.get_all_by_user_id(user_id)

        for el in group_participant:
            group_ids.append(el.group_id)
            group_participant_map[el.group_id] = el

        groups = self.group_repository.get_by_multiple_id(group_ids)

        for group in groups:
            member_list = []

            created_by = self.user_service.get_user_by_id(group.created_by)

            participant = group_participant_map.get(group.id)

            group_participants = self.group_participant_repository.get_all_by_group_id(group.id)

            for participant in group_participants:
                user = self.user_service.get_user_by_id(participant.user_id)
                member_list.append(user)

            group_wrapper_list.append(
                GroupWrapper(
                    id=group.id,
                    group_name=group.group_name,
                    description=group.description,
                    created_by=created_by.name,
                    created_at=group.created_at,
                    entry_date=participant.entry_date,
                    members=member_list
                )
            )
        return group_wrapper_list

    def create_group(self,user_id:int, new_group:NewGroup):
        if self.group_repository.get_group_by_alias(new_group.group_alias):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="There is already a group with this alias"
            )

        group = self.group_repository.create_group(
            new_group.group_alias,
            new_group.group_name,
            new_group.description,
            user_id
        )
        self.group_participant_repository.add_participant(user_id, group.id)

        return group

    def delete_group(self, user_id:int, group_id:int):
        group = self.group_repository.get_group_by_id(group_id)

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        if group.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Only owners can delete groups"
            )
        self.group_participant_repository.remove_all_participants(group_id)
        return self.group_repository.delete_group(group_id)

    def join_group(self, user_id, group_alias):
        group = self.group_repository.get_group_by_alias(group_alias)
        self.group_participant_repository.add_participant(user_id, group.id)

    def leave_group(self, user_id, group_alias):
        group = self.group_repository.get_group_by_alias(group_alias)
        self.group_participant_repository.remove_participant(user_id, group.id)
