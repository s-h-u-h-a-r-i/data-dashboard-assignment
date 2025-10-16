from collections.abc import Iterator
from pathlib import Path
import re

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import settings


"""
Ensures the parent directory for the SQLite database file exists if a SQLite database is being used.

This prevents errors when the application attempts to create or access the SQLite database file
in a directory that does not yet exist.
"""
if settings.using_sqlite_db:
    db_path_match = re.search(r"sqlite:///(.+)", settings.DATABASE_URL)
    if db_path_match:
        db_file_path = Path(db_path_match.group(1))
        db_file_path.parent.mkdir(parents=True, exist_ok=True)


engine = create_engine(
    url=settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.using_sqlite_db else {},
    echo=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app.services.data_generator import seed_database

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


__all__ = ("Base",)
