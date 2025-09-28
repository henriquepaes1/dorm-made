from pydantic import BaseModel
from datetime import datetime

# Pydantic models
class UserBase(BaseModel):
    name: str
    email: str
    university: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str