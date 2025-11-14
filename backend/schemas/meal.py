from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class MealBase(BaseModel):
    title: str
    description: str
    ingredients: str


class MealCreate(MealBase):
    """Schema for creating a meal (used with FormData)"""
    pass


class Meal(MealBase):
    """Schema for returning meal data"""
    id: str
    user_id: str
    image_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)