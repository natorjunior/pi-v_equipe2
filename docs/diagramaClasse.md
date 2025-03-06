### Diagrama de Classes

```plantuml
@startuml
class User {
    +int id
    +string name
    +string email
    +string password_hash
    +string avatar
    +timestamp created_at
}

class Group {
    +int id
    +string name
    +string description
    +int created_by
    +timestamp created_at
}

class GroupMembers {
    +int id
    +int group_id
    +int user_id
    +timestamp joined_at
}

class Checkin {
    +int id
    +int group_id
    +int user_id
    +string title
    +string description
    +string photo
    +timestamp created_at
}

User "1" -- "0..*" Group : "created_by"
Group "1" -- "0..*" GroupMember : "group_id"
User "1" -- "0..*" GroupMember : "user_id"
Group "1" -- "0..*" Checkin : "group_id"
User "1" -- "0..*" Checkin : "user_id"
@enduml
```

[![Diagrama de Classe](https://img.plantuml.biz/plantuml/svg/fPEnJWCn38RtI7a7AoEe5QnCbHXOMPXFLc9w5fVab3WiY7SdLNEwHfH2HJP_iltRVv9T5anI_AILdJ1dUCa54qVuq0hgkUKWmAu5MHA7FOJegIVaaQSUPGeZ3YFciUVuZbMoCM5FTG8_WqsCBWxajVhKQfdcAPNvsbaSvThCOZofQjtdU9NmSxM6BSyOXFBvAGx1_f0xTAWSNLpXgkVg-WC5IUYmatmSoRvn-9zEyq1OoXGl-zBmQvJugodBgp3t1ZORC7VRxOrfj_C0PhNNQ7MaPp9xEslPif2vAF2jR5tw1xN5oRz8dEHsVNSKNFqMNm00)](https://editor.plantuml.com/uml/fPEnJWCn38RtI7a7AoEe5QnCbHXOMPXFLc9w5fVab3WiY7SdLNEwHfH2HJP_iltRVv9T5anI_AILdJ1dUCa54qVuq0hgkUKWmAu5MHA7FOJegIVaaQSUPGeZ3YFciUVuZbMoCM5FTG8_WqsCBWxajVhKQfdcAPNvsbaSvThCOZofQjtdU9NmSxM6BSyOXFBvAGx1_f0xTAWSNLpXgkVg-WC5IUYmatmSoRvn-9zEyq1OoXGl-zBmQvJugodBgp3t1ZORC7VRxOrfj_C0PhNNQ7MaPp9xEslPif2vAF2jR5tw1xN5oRz8dEHsVNSKNFqMNm00)
