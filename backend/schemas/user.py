from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Pydantic models
class UserBase(BaseModel):
    name: str
    email: str
    university: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True