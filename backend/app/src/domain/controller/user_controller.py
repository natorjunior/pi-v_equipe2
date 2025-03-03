from fastapi import APIRouter

router = APIRouter(prefix="/user")

@router.get("")
def get_all():
    pass

@router.get("/{user_id}")
def get_user_by_id(user_id):
    pass

@router.post("")
def create_user(new_user):
    pass

@router.put("/{user_id}")
def update_user_by_id(user_id, user_changes):
    pass

@router.delete("/{user_id}")
def delete_user_by_id(user_id):
    pass