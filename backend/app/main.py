from datetime import datetime, timedelta, timezone
from os import getenv
from uuid import uuid4

import jwt
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

ACCESS_TOKEN_EXPIRE_SECONDS = 300
JWT_ALGORITHM = "HS256"
JWT_SECRET_KEY = getenv(
    "JWT_SECRET_KEY", "change-me-in-production-with-32chars"
)
VALID_USERNAME = "admin"
VALID_PASSWORD = "admin123"

app = FastAPI(title="JWT Demo API", version="1.0.0")


class LoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = ACCESS_TOKEN_EXPIRE_SECONDS


def create_access_token(subject: str) -> str:
    issued_at = datetime.now(timezone.utc)
    expires_at = issued_at + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
    payload = {
        "sub": subject,
        "iat": issued_at,
        "exp": expires_at,
        "jti": str(uuid4()),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc


@app.post("/token", response_model=TokenResponse)
def issue_token(credentials: LoginRequest) -> TokenResponse:
    if (
        credentials.username != VALID_USERNAME
        or credentials.password != VALID_PASSWORD
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return TokenResponse(access_token=create_access_token(credentials.username))


@app.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshRequest) -> TokenResponse:
    decoded = decode_token(payload.token)
    subject = decoded.get("sub")
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
        )
    return TokenResponse(access_token=create_access_token(subject))
