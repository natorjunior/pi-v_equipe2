# Documentação de Rotas

### Raiz

#### Diagrama

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A1(/):::blue
foo-a1("get_version()"):::blue

A --> A1 --- foo-a1
```

#### Rotas

#### GET:base-url/
> Retorna:  Número da versão atual do back-end.

### Usuário

#### Diagrama

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A --> B

B(/user)

B1(/):::blue
foo-b1("get_all ()"):::blue

B2(/user_id):::blue
foo-b2("get_user_by_id(user_id)"):::blue

B3(/):::green
foo-b3("create_user()"):::green

B4(/user_id):::orange
foo-b4("update_user_by_id(user_id)"):::orange

B5(/user_id):::red
foo-b5("delete_user_by_id(user_id)"):::red

B --> B1 --- foo-b1
B --> B2 --- foo-b2
B --> B3 --- foo-b3
B --> B4 --- foo-b4
B --> B5 --- foo-b5
```

#### Rotas

#### GET:base-url/user
Solicita a listagem com todos os usuários cadastrados.
> Retorna: Array de entidades Usuário.

#### GET:base-url/user/user_id
Solicita os dados de um usuário de acordo com o id.
> Recebe: Parâmetro user_id.
> Retorna: Entidade Usuário.

#### POST:base-url/user
Salva os dados cadastrais de um usuário.
> Recebe: Body com os dados cadastrais do usuário.
> Retorna: Entidade Usuário.

#### PUT:base-url/user/user_id
Atualiza os dados cadastrais de um usuário de acordo com o id.
> Recebe: Body com os dados de atualização do usuário.
> Retorna: Entidade Usuário atualizada.

#### DELETE:base-url/user/user_id
Apaga os dados de um usuário de acordo com o id.
> Recebe: Parâmetro user_id.
> Retorna: Boleano.

### Grupo

#### Diagrama

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A --> C

C(/group)

C1(/):::blue
foo-c1("get_all()"):::blue

C2(/group_id):::blue
foo-c2("get_group_by_id(group_id)"):::blue

C3(/user/user_id):::blue
foo-c3("get_group_by_user_id(user_id)"):::blue

C4(/):::green
foo-c4("create_group_by_id()"):::green

C5(/group_id):::orange
foo-c5("update_group_by_id(group_id)"):::orange

C6(/group_id):::red
foo-c6("delete_group_by_id(group_id)"):::red

C --> C1 --- foo-c1
C --> C2 --- foo-c2
C --> C3 --- foo-c3
C --> C4 --- foo-c4
C --> C5 --- foo-c5
C --> C6 --- foo-c6
```

#### Rotas

#### GET:base-url/group
Solicita a listagem com todos os grupos cadastrados.
> Retorna: Array de entidades Grupo.

#### GET:base-url/group/group_id
Solicita os dados de um Grupo de acordo com o id.
> Recebe: Parâmetro group_id.
> Retorna: Entidade Grupo.

#### GET:base-url/group/user/user_id
Solicita a lista de grupos dos quais o usuário faz parte.
> Recebe: Parâmetro user_id.
> Retorna: Array de entidades Grupo.

#### POST:base-url/group
Salva os dados cadastrais de um grupo de acordo com o id.
> Recebe: Body com os dados cadastrais do grupo.
> Retorna: Entidade Grupo.

#### PUT:base-url/group/group_id
Atualiza os dados cadastrais de um grupo de acordo com o id.
> Recebe: Body com os dados de atualização do grupo.
> Retorna: Entidade Time atualizada.

#### DELETE:base-url/group/group_id
Apaga os dados de um grupo de acordo com o id.
> Recebe: Parâmetro group_id.
> Retorna: Boleano.

### Check-in

#### Diagrama

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A --> D

D(/check-in)

D1(/):::blue
foo-d1("get_all()"):::blue

D2(/checkin_id):::blue
foo-d2("get_checkin_by_id(checkin_id)"):::blue

D3(/user/user_id):::blue
foo-d3("get_checkin_by_user_id(user_id)"):::blue

D4(/):::green
foo-d4("create_checkin()"):::green

D5(/checkin_id):::orange
foo-d5("update_checkin_by_id(checkin_id)"):::orange

D6(/checkin_id):::red
foo-d6("delete_checkin_by_id(checkin_id)"):::red

D --> D1 --- foo-d1
D --> D2 --- foo-d2
D --> D3 --- foo-d3
D --> D4 --- foo-d4
D --> D5 --- foo-d5
D --> D6 --- foo-d6
```

#### Rotas

#### GET:base-url/check-in
Solicita a listagem com todos os check-ins cadastrados.
> Retorna: Array de entidades Checkin.

#### GET:base-url/check-in/checkin_id
Solicita os dados de um check-in de acordo com o id.
> Recebe: Parâmetro checkin_id.
> Retorna: Entidade Checkin.

#### GET:base-url/check-in/user/user_id
Solicita a lista de check-ins registrados pelo usuário.
> Recebe: Parâmetro user_id.
> Retorna: Array de entidades Checkin.

#### POST:base-url/check-in
Salva os dados cadastrais de um check-in.
> Recebe: Body com os dados cadastrais do check-in.
> Retorna: Entidade Checkin.

#### PUT:base-url/check-in/checkin_id
Atualiza os dados cadastrais de um check-in.
> Recebe: Body com os dados de atualização do check-in.
> Retorna: Entidade Checkin atualizada.

#### DELETE:base-url/check-in/checkin_id
Apaga os dados de um check-in de acordo com o id.
> Recebe: Parâmetro checkin_id.
> Retorna: Boleano.

### Autenticação

#### Diagrama

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A --> E

E(/autentication)

E1(/login):::green
foo-e5("login(user, password)"):::green

E --> E1 --- foo-e5
```

#### Rotas

#### POST:base-url/autentication/login
> Recebe: Body com os dados de login (Usuário e senha). 
> Retorna: Token JWT.

## Diagrama geral de rotas

```mermaid
flowchart LR

classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

A[base-url]

A1(/):::blue
foo-a1("get_version()"):::blue

A --> A1 --- foo-a1
A --> B
A --> C
A --> D
A --> E

B(/user)

B1(/):::blue
foo-b1("get_all ()"):::blue

B2(/user_id):::blue
foo-b2("get_user_by_id(user_id)"):::blue

B3(/):::green
foo-b3("create_user()"):::green

B4(/user_id):::orange
foo-b4("update_user_by_id(user_id)"):::orange

B5(/user_id):::red
foo-b5("delete_user_by_id(user_id)"):::red

B --> B1 --- foo-b1
B --> B2 --- foo-b2
B --> B3 --- foo-b3
B --> B4 --- foo-b4
B --> B5 --- foo-b5

C(/group)

C1(/):::blue
foo-c1("get_all()"):::blue

C2(/group_id):::blue
foo-c2("get_group_by_id(group_id)"):::blue

C3(/user/user_id):::blue
foo-c3("get_group_by_user_id(user_id)"):::blue

C4(/):::green
foo-c4("create_group_by_id()"):::green

C5(/group_id):::orange
foo-c5("update_group_by_id(group_id)"):::orange

C6(/group_id):::red
foo-c6("delete_group_by_id(group_id)"):::red

C --> C1 --- foo-c1
C --> C2 --- foo-c2
C --> C3 --- foo-c3
C --> C4 --- foo-c4
C --> C5 --- foo-c5
C --> C6 --- foo-c6

D(/check-in)

D1(/):::blue
foo-d1("get_all()"):::blue

D2(/checkin_id):::blue
foo-d2("get_checkin_by_id(checkin_id)"):::blue

D3(/user/user_id):::blue
foo-d3("get_checkin_by_user_id(user_id)"):::blue

D4(/):::green
foo-d4("create_checkin()"):::green

D5(/checkin_id):::orange
foo-d5("update_checkin_by_id(checkin_id)"):::orange

D6(/checkin_id):::red
foo-d6("delete_checkin_by_id(checkin_id)"):::red

D --> D1 --- foo-d1
D --> D2 --- foo-d2
D --> D3 --- foo-d3
D --> D4 --- foo-d4
D --> D5 --- foo-d5
D --> D6 --- foo-d6

E(/autentication)

E1(/login):::green
foo-e5("login(user, password)"):::green

E --> E1 --- foo-e5
```

### Legenda
```mermaid
flowchart TB
classDef blue stroke:#0000FF
classDef green stroke:#00FF00
classDef orange stroke:#FFA500 
classDef red stroke:#FF0000

GET[GET]:::blue
POST[POST]:::green
PUT[PUT]:::orange
DELETE[DELETE]:::red 
```
