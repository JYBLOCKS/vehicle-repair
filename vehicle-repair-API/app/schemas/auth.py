from pydantic import BaseModel

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str | None = None

class LoginIn(BaseModel):
    email: str
    password: str
