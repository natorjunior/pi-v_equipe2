import os
from dotenv import load_dotenv

dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__),'..', 'environments', '.env'))
print(f"Carregando .env de: {dotenv_path}")

if not os.path.exists(dotenv_path):
    raise RuntimeError(f".env não encontrado no caminho {dotenv_path}")

loaded = load_dotenv(dotenv_path)
print(f"load_dotenv returned: {loaded}")

database_url = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {database_url}")

if not database_url:
    raise RuntimeError("DATABASE_URL não encontrada no .env")
