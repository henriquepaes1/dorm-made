from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class RecipeBase(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    instructions: str
    prep_time: int  # in minutes
    difficulty: str  # easy, medium, hard

class RecipeCreate(RecipeBase):
    user_id: int

class Recipe(RecipeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True