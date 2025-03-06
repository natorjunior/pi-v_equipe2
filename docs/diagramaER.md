#### Diagrama de Entidade-Relacionamento (ER)

```plantuml
@startuml
entity users {
    +id : int
    --
    name : varchar(100)
    email : varchar(100)
    password_hash : text
    avatar : text
    created_at : timestamp
}

entity groups {
    +id : int
    --
    name : varchar(100)
    description : text
    created_by : int
    created_at : timestamp
}

entity group_members {
    +id : int
    --
    group_id : int
    user_id : int
    joined_at : timestamp
}

entity checkins {
    +id : int
    --
    group_id : int
    user_id : int
    title : varchar(255)
    description : text
    photo : text
    created_at : timestamp
}

users ||--o{ groups : "created_by"
groups ||--o{ group_members : "group_id"
users ||--o{ group_members : "user_id"
groups ||--o{ checkins : "group_id"
users ||--o{ checkins : "user_id"
@enduml
```

[![Diagrama ER](https://img.plantuml.biz/plantuml/svg/hLFBQiCm4BmB_0_2fvPYI0kvv9G_COkqhPPQ3_G8AKd_lLji9tRYfALK5w5PxSne96rJXfYBxIg1BbF-a2KLYEIJF5H2ydWYBJUINEwNJTFFpbjaV0TH6OWFpwlLOrz02zGjLX8w0ws1PBYSSJymmWxOmmnIaK3x5kqtIXRPf0sL-Ap4oUPRBE7l9ZKcrb3WbsI3ZrEotvff0oT9YWAuZ3yvwplcjI7v2rHpEYthHD1msu4ogDx9_PigavREJx9xMQ_lPlVgysAOYx6TtjZns3J-C5xcHjRdAwWhCS3JJHSXSyTufle6xNN7-SHN6cECztadksPSMtIQlz8N)](https://editor.plantuml.com/uml/hLFBQiCm4BmB_0_2fvPYI0kvv9G_COkqhPPQ3_G8AKd_lLji9tRYfALK5w5PxSne96rJXfYBxIg1BbF-a2KLYEIJF5H2ydWYBJUINEwNJTFFpbjaV0TH6OWFpwlLOrz02zGjLX8w0ws1PBYSSJymmWxOmmnIaK3x5kqtIXRPf0sL-Ap4oUPRBE7l9ZKcrb3WbsI3ZrEotvff0oT9YWAuZ3yvwplcjI7v2rHpEYthHD1msu4ogDx9_PigavREJx9xMQ_lPlVgysAOYx6TtjZns3J-C5xcHjRdAwWhCS3JJHSXSyTufle6xNN7-SHN6cECztadksPSMtIQlz8N)
