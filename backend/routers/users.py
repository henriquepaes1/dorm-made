from fastapi import APIRouter, Depends
from typing import List, Annotated
from schemas.user import User, UserCreate, UserLogin, Token, LoginResponse
from schemas.event import Event
from utils.auth import get_current_user_id

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    from services.user_service import create_user
    return await create_user(user)

@router.post("/login", response_model=LoginResponse)
async def login(login_data: UserLogin):
    """Authenticate user and return JWT token"""
    from services.user_service import authenticate_user
    return await authenticate_user(login_data)

@router.get("/me/events", response_model=List[Event])
async def get_my_events(current_user_id: Annotated[str, Depends(get_current_user_id)]):
    """Get all events created by the authenticated user"""
    from services.event_service import get_user_events
    return await get_user_events(current_user_id)

@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify users router is working"""
    return {"message": "Users router is working"}

@router.get("/me/joined-events", response_model=List[Event])
async def get_my_joined_events(current_user_id: Annotated[str, Depends(get_current_user_id)]):
    """Get all events that the authenticated user has joined"""
    from services.event_service import get_user_joined_events
    try:
        return await get_user_joined_events(current_user_id)
    except Exception as e:
        print(f"Error in get_my_joined_events: {e}")
        # For now, return empty list if table doesn't exist
        return []