from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.src.domain.service.checkin_service import CheckinService
from app.src.domain.dto.checkin_dto import CheckinCreateDTO, CheckinUpdateDTO, CheckinResponseDTO
from app.src.infra.database.database import get_session

router = APIRouter(prefix="/check-in", tags=["Check-ins"])


@router.post("", response_model=CheckinResponseDTO)
def create_checkin(
    checkin_data: CheckinCreateDTO = Depends(),
    photo: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
):
    service = CheckinService(session)
    return service.create_checkin(checkin_data=checkin_data, photo=photo)


@router.get("", response_model=List[CheckinResponseDTO])
def get_all_checkins(session: Session = Depends(get_session)):
    service = CheckinService(session)
    return service.get_all_checkins()


@router.get("/{checkin_id}", response_model=CheckinResponseDTO)
def get_checkin_by_id(checkin_id: int, session: Session = Depends(get_session)):
    service = CheckinService(session)
    return service.get_checkin_by_id(checkin_id)


@router.get("/user/{user_id}", response_model=List[CheckinResponseDTO])
def get_checkins_by_user(user_id: int, session: Session = Depends(get_session)):
    service = CheckinService(session)
    return service.get_checkins_by_user_id(user_id)


@router.get("/group/{group_id}", response_model=List[CheckinResponseDTO])
def get_checkins_by_group(group_id: int, session: Session = Depends(get_session)):
    service = CheckinService(session)
    return service.get_checkins_by_group_id(group_id)


@router.put("/{checkin_id}", response_model=CheckinResponseDTO)
def update_checkin_by_id(
    checkin_id: int,
    checkin_changes: CheckinUpdateDTO,
    session: Session = Depends(get_session),
):
    service = CheckinService(session)
    return service.update_checkin_by_id(checkin_id, checkin_changes)


@router.delete("/{checkin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_checkin_by_id(self, checkin_id: int):
    checkin = self.get_checkin_by_id(checkin_id)
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in não encontrado")
    self.session.delete(checkin)
    self.session.commit()
