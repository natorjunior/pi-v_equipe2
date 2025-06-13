import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'environments', '.env'))

print(f"Carregando .env de: {dotenv_path}")

if not os.path.exists(dotenv_path):
    raise RuntimeError(f".env não encontrado no caminho {dotenv_path}")

loaded = load_dotenv(dotenv_path)
print(f"load_dotenv returned: {loaded}")

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL não encontrada no .env")

print(f"DATABASE_URL: {database_url}")

config = context.config

config.set_main_option("sqlalchemy.url", database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from app.src.infra.database.base import Base
from app.src.domain.model.checkin import Checkin
from app.src.domain.model.group_participant import GroupParticipant
from app.src.domain.model.group import Group
from app.src.domain.model.like_checkin import LikeCheckin
from app.src.domain.model.user import User

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
