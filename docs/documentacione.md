# Documentação do Banco de Dados

Este documento descreve a estrutura do banco de dados, incluindo as tabelas e seus relacionamentos.

## Tabelas

### `users`

A tabela `users` armazena informações sobre os usuários do sistema.

| Coluna          | Tipo           | Descrição                                          |
| --------------- | -------------- | -------------------------------------------------- |
| `id`            | `int`          | Identificador único do usuário (chave primária).   |
| `name`          | `varchar(100)` | Nome do usuário.                                   |
| `email`         | `varchar(100)` | E-mail do usuário (único).                         |
| `password_hash` | `text`         | Hash da senha do usuário.                          |
| `avatar`        | `text`         | URL ou caminho para a imagem do avatar do usuário. |
| `created_at`    | `timestamp`    | Data e hora de criação do registro.                |

**Índices:**

- `PRIMARY KEY (id)`
- `UNIQUE KEY (email)`

### `groups`

A tabela `groups` armazena informações sobre os grupos criados pelos usuários.

| Coluna        | Tipo           | Descrição                                                                       |
| ------------- | -------------- | ------------------------------------------------------------------------------- |
| `id`          | `int`          | Identificador único do grupo (chave primária).                                  |
| `name`        | `varchar(100)` | Nome do grupo.                                                                  |
| `description` | `text`         | Descrição do grupo.                                                             |
| `created_by`  | `int`          | Identificador do usuário que criou o grupo (chave estrangeira para `users.id`). |
| `created_at`  | `timestamp`    | Data e hora de criação do grupo.                                                |

**Índices:**

- `PRIMARY KEY (id)`
- `KEY (created_by)`

**Restrições:**

- `FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE`

### `group_members`

A tabela `group_members` armazena a relação entre usuários e grupos, indicando quais usuários participam de quais grupos.

| Coluna       | Tipo        | Descrição                                                        |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `id`         | `int`       | Identificador único do registro (chave primária).                |
| `group_id`   | `int`       | Identificador do grupo (chave estrangeira para `grupos.id`).     |
| `usuario_id` | `int`       | Identificador do usuário (chave estrangeira para `usuarios.id`). |
| `join_date`  | `timestamp` | Data e hora em que o usuário entrou no grupo.                    |

**Índices:**

- `PRIMARY KEY (id)`
- `KEY (group_id)`
- `KEY (user_id)`

**Restrições:**

- `FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

### `checkin`

A tabela `checkin` armazena as postagens feitas por usuários em grupos.

| Coluna        | Tipo           | Descrição                                                                        |
| ------------- | -------------- | -------------------------------------------------------------------------------- |
| `id`          | `int`          | Identificador único da postagem (chave primária).                                |
| `group_id`    | `int`          | Identificador do grupo (chave estrangeira para `groups.id`).                     |
| `users_id`    | `int`          | Identificador do usuário que fez a postagem (chave estrangeira para `users.id`). |
| `title`       | `varchar(255)` | Título da postagem.                                                              |
| `description` | `text`         | Descrição ou conteúdo da postagem.                                               |
| `photo`       | `text`         | URL ou caminho para a imagem da postagem.                                        |
| `created_at`  | `timestamp`    | Data e hora de criação da postagem.                                              |

**Índices:**

- `PRIMARY KEY (id)`
- `KEY (group_id)`
- `KEY (user_id)`

**Restrições:**

- `FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE`
- `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`

## Relacionamentos

- **`groups`**:

  - Um grupo é criado por um usuário (`created_by` referencia `users.id`).

- **`group_members`**:

  - Um usuário pode participar de vários grupos (`user_id` referencia `users.id`).
  - Um grupo pode ter vários participantes (`group_id` referencia `groups.id`).

- **`checkin`**:
  - Um usuário pode fazer várias postagens em grupos (`user_id` referencia `user.id`).
  - Um grupo pode ter várias postagens (`group_id` referencia `group.id`).

## Considerações

- Todas as tabelas utilizam o mecanismo de armazenamento `InnoDB` e o conjunto de caracteres `utf8mb4` com collation `utf8mb4_0900_ai_ci`.
- As chaves estrangeiras estão configuradas com `ON DELETE CASCADE`, o que significa que, se um registro na tabela referenciada for excluído, todos os registros relacionados nas tabelas dependentes também serão excluídos automaticamente.
