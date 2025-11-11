from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List, Annotated
from sqlalchemy.orm import Session

from schemas.user import User, UserCreate, UserLogin, UserUpdate, LoginResponse
from schemas.event import Event
from utils.auth import get_current_user_id
from utils.database import get_db
from services import user_service, event_service

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    return await user_service.create_user(user, db)

@router.post("/login", response_model=LoginResponse)
async def login_endpoint(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    return await user_service.authenticate_user(login_data, db)

@router.get("/me/events", response_model=List[Event])
async def get_my_events_endpoint(
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db)
):
    """Get all events created by the authenticated user"""
    return await event_service.get_user_events(current_user_id, db)

@router.get("/me/joined-events", response_model=List[Event])
async def get_my_joined_events_endpoint(
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db)
):
    """Get all events that the authenticated user has joined"""
    return await event_service.get_user_joined_events(current_user_id, db)

@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify users router is working"""
    return {"message": "Users router is working"}

@router.get("/search", response_model=List[User])
async def search_users_endpoint(query: str, limit: int = 10, db: Session = Depends(get_db)):
    """Search users by name"""
    return await user_service.search_users(query, db, limit)

# More specific routes should come BEFORE generic ones to avoid routing conflicts
@router.post("/{user_id}/profile-picture", response_model=User)
async def upload_profile_picture_endpoint(
    user_id: str,
    image: Annotated[UploadFile, File()],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db)
):
    """Upload a profile picture for the user (only the authenticated user can upload their own picture)"""
    print(f"[DEBUG] Upload profile picture - user_id: {user_id}, current_user_id: {current_user_id}")
    print(f"[DEBUG] File received: {image.filename}, Content-Type: {image.content_type}")

    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode fazer upload da sua própria foto de perfil")

    return await user_service.upload_profile_picture(user_id, image, db)

@router.patch("/{user_id}", response_model=User)
async def update_user_profile_endpoint(
    user_id: str,
    user_update: UserUpdate,
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    db: Session = Depends(get_db)
):
    """Update user profile (only the authenticated user can update their own profile)"""
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")

    return await user_service.update_user(user_id, user_update, db)

@router.get("/{user_id}/events", response_model=List[Event])
async def get_user_events_by_id_endpoint(user_id: str, db: Session = Depends(get_db)):
    """Get all events created by a specific user (public endpoint)"""
    try:
        return await event_service.get_user_events(user_id, db)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error fetching user events: {str(e)}")

# Generic route last
@router.get("/{user_id}", response_model=User)
async def get_user_by_id_endpoint(user_id: str, db: Session = Depends(get_db)):
    """Get user by ID"""
    print(f"GET /users/{user_id} called")
    user = await user_service.get_user(user_id, db)
    print(f"User found: {user is not None}")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user