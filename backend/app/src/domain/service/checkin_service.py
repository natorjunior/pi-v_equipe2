from app.src.domain.model.checkin import Checkin
from sqlalchemy.orm import Session
from backend.app.src.adapter.minio_storage import upload_file_to_minio
from app.src.domain.dto.checkin_dto import CheckinCreateDTO, CheckinUpdateDTO
from fastapi import HTTPException, UploadFile

class CheckinService:
    def __init__(self, session: Session):
        self.session = session

    def create_checkin(self, checkin_data: CheckinCreateDTO, photo: UploadFile = None):
        photo_url = None

        if photo:
            photo_url = upload_file_to_minio(photo, bucket_name="checkin-photos")

        checkin = Checkin(
            group_id=checkin_data.group_id,
            user_id=checkin_data.user_id,
            title=checkin_data.title,
            description=checkin_data.description,
            photo=photo_url
        )
        self.session.add(checkin)
        self.session.commit()
        self.session.refresh(checkin)
        return checkin

    def get_checkins_by_group_id(self, group_id: int):
        return self.session.query(Checkin).filter(Checkin.group_id == group_id).order_by(Checkin.created_at.desc()).all()

    def get_checkins_by_user_id(self, user_id: int):
        return self.session.query(Checkin).filter(Checkin.user_id == user_id).order_by(Checkin.created_at.desc()).all()

    def get_checkin_by_id(self, checkin_id: int):
        checkin = self.session.query(Checkin).filter(Checkin.id == checkin_id).first()
        if not checkin:
            raise HTTPException(status_code=404, detail="Check-in não encontrado")
        return checkin

    def get_all_checkins(self):
        return self.session.query(Checkin).order_by(Checkin.created_at.desc()).all()

    def update_checkin_by_id(self, checkin_id: int, checkin_changes: CheckinUpdateDTO):
        checkin = self.get_checkin_by_id(checkin_id)
        if not checkin:
            raise Exception("Check-in não encontrado")

        if checkin_changes.title is not None:
            checkin.title = checkin_changes.title
        if checkin_changes.description is not None:
            checkin.description = checkin_changes.description

        self.session.commit()
        self.session.refresh(checkin)
        return checkin

    def delete_checkin_by_id(self, checkin_id: int):
        checkin = self.get_checkin_by_id(checkin_id)
        if not checkin:
            raise Exception("Check-in não encontrado")

        self.session.delete(checkin)
        self.session.commit()
