from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from typing import List, Annotated
from schemas.user import User, UserCreate, UserLogin, UserUpdate, Token, LoginResponse
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

@router.get("/test")
async def test_endpoint():
    """Test endpoint to verify users router is working"""
    return {"message": "Users router is working"}

@router.get("/search", response_model=List[User])
async def search_users(query: str, limit: int = 10):
    """Search users by name"""
    from services.user_service import search_users
    return await search_users(query, limit)

# Rotas mais específicas devem vir ANTES das genéricas para evitar conflitos de roteamento
@router.post("/{user_id}/profile-picture", response_model=User)
async def upload_profile_picture(
    user_id: str,
    image: Annotated[UploadFile, File()],
    current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Upload a profile picture for the user (only the authenticated user can upload their own picture)"""
    print(f"[DEBUG] Upload profile picture - user_id: {user_id}, current_user_id: {current_user_id}")
    print(f"[DEBUG] File received: {image.filename}, Content-Type: {image.content_type}")
    
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="Você só pode fazer upload da sua própria foto de perfil")
    
    from services.user_service import upload_profile_picture
    return await upload_profile_picture(user_id, image)

@router.patch("/{user_id}", response_model=User)
async def update_user_profile(
    user_id: str,
    user_update: UserUpdate,
    current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Update user profile (only the authenticated user can update their own profile)"""
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    
    from services.user_service import update_user
    return await update_user(user_id, user_update)

@router.get("/{user_id}/events", response_model=List[Event])
async def get_user_events_by_id(user_id: str):
    """Get all events created by a specific user (public endpoint)"""
    from services.event_service import get_user_events
    try:
        return await get_user_events(user_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error fetching user events: {str(e)}")

# Rota genérica por último
@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    """Get user by ID"""
    print(f"GET /users/{user_id} called")
    from services.user_service import get_user
    user = await get_user(user_id)
    print(f"User found: {user is not None}")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user