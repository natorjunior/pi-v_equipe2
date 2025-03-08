from fastapi import APIRouter

router = APIRouter(prefix="/check-in")

@router.get("")
def get_all():
    pass

@router.get("/{checkin_id}")
def get_checkin_by_id(checkin_id):
    pass

@router.get("/user/{user_id}")
def get_checkin_by_user_id(user_id):
    pass

@router.post("")
def create_checkin(new_checkin):
    pass

@router.put("/{checkin_id}")
def update_checkin_by_id(checkin_id, checkin_changes):
    pass

@router.delete("/{checkin_id}")
def delete_checkin_by_id(checkin_id):
    pass