from fastapi import APIRouter

router = APIRouter(prefix="/group")

@router.get("")
def get_all():
    pass

@router.get("/{group_id}")
def get_group_by_id(group_id):
    pass

@router.get("/user/{user_id}")
def get_group_by_user_id(user_id):
    pass

@router.post("")
def create_group(new_group):
    pass

@router.put("/{group_id}")
def update_group_by_id(group_id, user_changes):
    pass

@router.delete("/{group_id}")
def delete_group_by_id(group_id):
    pass