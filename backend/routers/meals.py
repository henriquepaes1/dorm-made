from fastapi import APIRouter, Depends, File, UploadFile, Form
from typing import List, Annotated, Optional
from sqlalchemy.orm import Session

from schemas.meal import Meal
from utils.auth import get_current_user_id
from utils.database import get_db
from services import meal_service

router = APIRouter(prefix="/meals", tags=["meals"])


@router.post("/", response_model=Meal, status_code=201, response_model_by_alias=True)
async def create_meal_endpoint(
    name: Annotated[str, Form()],
    description: Annotated[str, Form()],
    ingredients: Annotated[str, Form()],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db),
    image: Annotated[Optional[UploadFile], File()] = None
):
    """Create a new meal with optional image upload"""
    return await meal_service.create_meal(
        name=name,
        description=description,
        ingredients=ingredients,
        user_id=current_user_id,
        db=db,
        image=image
    )


@router.get("/{meal_id}", response_model=Meal, response_model_by_alias=True)
async def get_meal_endpoint(
    meal_id: str,
    db: Session = Depends(get_db)
):
    """Get details of a specific meal"""
    return await meal_service.get_meal(meal_id, db)