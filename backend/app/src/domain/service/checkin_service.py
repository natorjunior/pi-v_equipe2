from starlette import status

from app.src.domain.model.checkin import Checkin
from sqlalchemy.orm import Session
from app.src.adapter.minio_adapter import upload_file_to_minio
from app.src.domain.dto.checkin_dto import CheckinCreate, CheckinUpdate, get_checkin_data_instance
from fastapi import HTTPException, UploadFile

from app.src.domain.repository.checkin_repository import CheckinRepository
from app.src.domain.service.group_service import GroupService
from app.src.domain.service.user_service import UserService


class CheckinService:
    def __init__(self, session: Session):
        self.checkin_repository = CheckinRepository(session)
        self.group_service = GroupService(session)
        self.user_service = UserService(session)


    def __return_checkin_instances(self, raw_checkins:[Checkin]):
        checkins = []
        for checkin in raw_checkins:
            user = self.user_service.get_user_by_id(checkin.user_id)
            checkins.append(get_checkin_data_instance(checkin, user))
        return checkins

    def get_checkins_by_user_id(self, user_id: int):
        checkins = self.checkin_repository.get_checkin_by_user_id(user_id)
        return self.__return_checkin_instances(checkins)

    def get_checkins_by_group_id(self, user_id, group_id: int):
        group = self.group_service.get_group_by_id(group_id)

        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        group_participant = self.group_service.get_group_participant_by_user_id_and_group_id(user_id, group_id)

        if not group_participant:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is not part of this group"
            )

        checkins = self.checkin_repository.get_checkin_by_group_id(group_id)

        return self.__return_checkin_instances(checkins)

    def create_checkin(self, user_id, checkin_data: CheckinCreate, checkin_photo: UploadFile = None):
        checkin_photo_url = "DEFAULT_CHECKIN_PHOTO.jpeg"

        if checkin_photo:
            checkin_photo_url = upload_file_to_minio(checkin_photo, bucket_name="checkin-photos")

        checkin = [self.checkin_repository.create_checkin(
            group_id=checkin_data.group_id,
            user_id=user_id,
            title=checkin_data.title,
            description=checkin_data.description,
            photo=checkin_photo_url
        )]

        return self.__return_checkin_instances(checkin)

    def update_checkin_by_id(self, user_id:int, checkin_changes: CheckinUpdate, checkin_photo):
        checkin = self.checkin_repository.get_checkin_by_id(checkin_changes.checkin_id)

        if not checkin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Check-in not found"
            )

        if checkin.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Only owners can update check-ins"
            )

        checkin_photo_url = None
        if checkin_photo:
            checkin_photo_url = upload_file_to_minio(checkin_photo, bucket_name="checkin-photos")

        self.checkin_repository.update_checkin(checkin_changes, checkin_photo_url)

    def delete_checkin_by_id(self, user_id:int, checkin_id: int):
        checkin = self.checkin_repository.get_checkin_by_id(checkin_id)

        if not checkin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Check-in not found"
            )

        if checkin.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Only owners can delete check-ins"
            )

        return self.checkin_repository.delete_checkin(checkin_id)
    
    def get_group_ranking(self, user_id: int, group_id: int):
        group = self.checkin_repository.get_ranking_by_group_id(group_id)
        
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                details="Group not found"
            )
            
        group_participant = self.group_service.get_group_participant_by_user_id_and_group_id(user_id, group_id)
        
        if not group_participant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not part of this group"
            )
            
        ranking = self.checkin_repository.get_ranking_by_group_id(group_id)
        
        ranking_with_positions = []
        
        for index, row in enumerate(ranking, start=1):
            user = self.user_service.get_user_by_id(row.user_id)
             
            ranking_with_positions.append({
                "position": index,
                "user": user,
                "checkin_count": row.checkin_count
            })
            
        return ranking_with_positions
