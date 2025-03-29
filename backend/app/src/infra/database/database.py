from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from app.src.infra.database.base import Base
from environments import constants

connection_string = constants.DATABASE_URL
engine = create_engine(connection_string)
session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = scoped_session(session_factory)
Base.metadata.create_all(engine)

def get_session():
    db_session = session()
    try:
        yield db_session
    finally:
        db_session.close()
        session.remove()
