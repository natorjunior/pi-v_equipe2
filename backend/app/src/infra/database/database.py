from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from environments import constants

connection_string = constants.DATABASE_URL
engine = create_engine(connection_string)
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
scoped_session = scoped_session(session_local)

def get_session():
    session = None

    try:
        session = scoped_session
        yield session

    except:
        session.rollback()
        raise

    finally:
        if session:
            session.close()
            session.remove()