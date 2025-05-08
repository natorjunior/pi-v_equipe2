from pydantic import BaseModel


class NewGroup(BaseModel):
    group_alias: str
    group_name: str
    description: str

class GroupWrapper:

    def __init__(self, **kwargs):
        self.id = kwargs["id"]
        self.group_name = kwargs["group_name"]
        self.description = kwargs["description"]
        self.created_by = kwargs["created_by"]
        self.created_at = kwargs["created_at"]
        self.entry_date = kwargs["entry_date"]
        self.members = kwargs["members"]
