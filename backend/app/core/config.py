from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    HOST: str = Field(
        default="127.0.0.1",
        description="The host address for the application.",
    )
    PORT: int = Field(
        default=8080,
        description="The port number for the application.",
    )

    OPENAI_API_KEY: str = Field(
        ...,
        description="Your OpenAI API key. Get it from https://platform.openai.com/api-keys",
    )

    DATABASE_URL: str = Field(
        default="sqlite:///./data/db",
        description="Database connection URL. Defaults to SQLite database in the current directory.",
    )

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def using_sqlite_db(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


settings = Settings()  # type: ignore[call-arg]

__all__ = ("settings",)
