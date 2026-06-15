from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "MEDAS API"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str
    REDIS_URL: str = "redis://redis:6379/0"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Flash Call provider (websms.ru)
    WEBSMS_LOGIN: str = ""
    WEBSMS_PASSWORD: str = ""

    # SMS fallback provider (SMSC.ru)
    SMSC_LOGIN: str = ""
    SMSC_PASSWORD: str = ""

    # Master OTP bypass (any phone + this code = login without real OTP)
    OTP_MASTER_CODE: str = ""

    # saas.med-as.ru = test domain; prod → med-as.ru (migration planned)
    CORS_ORIGINS: list[str] = [
        "https://saas.med-as.ru",
        "https://med-as.ru",
        "http://localhost:3000",
    ]


settings = Settings()  # type: ignore[call-arg]
