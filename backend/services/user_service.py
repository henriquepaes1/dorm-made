from fastapi import HTTPException
from typing import Optional
from database import supabase
from schemas.user import User, UserCreate

def get_user(user_id: int) -> Optional[User]:
    """Get user by ID from Supabase"""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data:
            return User(**result.data[0])
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

async def create_user(user: UserCreate) -> User:
    """Create a new user"""
    try:
        result = supabase.table("users").insert(user.model_dump()).execute()
        if result.data:
            return User(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")