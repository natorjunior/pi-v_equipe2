from pydantic import BaseModel


class NewGroup(BaseModel):
    group_alias: str
    group_name: str
    description: str