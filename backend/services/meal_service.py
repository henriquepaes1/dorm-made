from fastapi import HTTPException, UploadFile
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from models.meal import MealModel
from schemas.meal import Meal, MealCreate
from utils.converters import meal_model_to_schema, meal_models_to_schemas
from utils.supabase import supabase
from .user_service import get_user


async def upload_meal_image(image: UploadFile) -> str:
    """Upload a meal image to Supabase Storage and return the public URL"""
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if image.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please select a JPEG, PNG, or WebP image"
            )

        # Validate file size (5MB max)
        contents = await image.read()
        if len(contents) > 5 * 1024 * 1024:  # 5MB in bytes
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 5MB"
            )

        # Generate unique filename
        file_extension = image.filename.split('.')[-1] if image.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}_{int(datetime.now().timestamp())}.{file_extension}"

        # Upload to Supabase Storage (using meal-images bucket)
        result = supabase.storage.from_("meal-images").upload(
            unique_filename,
            contents,
            {"content-type": image.content_type}
        )

        # Get public URL
        public_url = supabase.storage.from_("meal-images").get_public_url(unique_filename)

        return public_url
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error uploading image: {str(e)}")


async def create_meal(
    name: str,
    description: str,
    ingredients: str,
    user_id: str,
    db: Session,
    image: Optional[UploadFile] = None
) -> Meal:
    """Create a new meal with optional image upload"""
    # Verify user exists
    user = await get_user(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Upload image if provided
        image_url = None
        if image and image.filename:
            image_url = await upload_meal_image(image)

        # Create new meal model
        meal_model = MealModel(
            id=str(uuid.uuid4()),
            user_id=str(user_id),
            title=name,
            description=description,
            ingredients=ingredients,
            image_url=image_url
        )

        db.add(meal_model)
        db.commit()
        db.refresh(meal_model)

        return meal_model_to_schema(meal_model)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating meal: {str(e)}")


async def get_user_meals(user_id: str, db: Session) -> List[Meal]:
    """Get all meals created by a specific user"""
    try:
        meal_models = db.query(MealModel).filter(
            MealModel.user_id == user_id
        ).order_by(MealModel.created_at.desc()).all()
        return meal_models_to_schemas(meal_models)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching user meals: {str(e)}")


async def get_meal(meal_id: str, db: Session) -> Meal:
    """Get a specific meal by ID"""
    try:
        meal_model = db.query(MealModel).filter(MealModel.id == meal_id).first()
        if not meal_model:
            raise HTTPException(status_code=404, detail="Meal not found")
        return meal_model_to_schema(meal_model)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching meal: {str(e)}")