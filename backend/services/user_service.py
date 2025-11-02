from fastapi import HTTPException
from typing import Optional, List
from database import supabase
from schemas.user import User, UserCreate, UserLogin, UserUpdate, Token, LoginResponse
from utils.password import hash_password, verify_password, create_access_token

async def get_user(user_id: str) -> Optional[User]:
    """Get user by ID from Supabase"""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data and len(result.data) > 0:
            user_data = result.data[0]
            # Ensure optional fields are handled correctly
            user_data.setdefault("university", None)
            user_data.setdefault("description", None)
            user_data.setdefault("profile_picture", None)
            return User(**user_data)
        return None
    except Exception as e:
        print(f"Error getting user: {e}")
        print(f"User ID: {user_id}")
        import traceback
        traceback.print_exc()
        return None

async def create_user(user: UserCreate) -> User:
    """Create a new user"""
    try:
        user_data = user.model_dump()
        hashed_password = hash_password(user_data.pop("password"))
        user_data["hashed_password"] = hashed_password

        result = supabase.table("users").insert(user_data).execute()
        if result.data:
            return User(**result.data[0])
        raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from Supabase including hashed_password"""
    try:
        result = supabase.table("users").select("*").eq("email", email).execute()
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None

def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID from Supabase - returns raw dict for auth purposes"""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None

async def authenticate_user(login_data: UserLogin) -> LoginResponse:
    """Authenticate user and return JWT token"""
    user = get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"Creating token with user ID: {user['id']} (type: {type(user['id'])})")
    access_token = create_access_token(data={"userId": user["id"]})
    
    # Create User object without hashed_password
    user_obj = User(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        university=user.get("university"),
        description=user.get("description"),
        profile_picture=user.get("profile_picture"),
        created_at=user["created_at"]
    )
    
    return LoginResponse(
        access_token=access_token, 
        token_type="bearer",
        user=user_obj
    )

async def update_user(user_id: str, user_update: UserUpdate) -> User:
    """Update user information"""
    try:
        # Prepare update data, only including fields that are not None
        update_data = {}
        if user_update.university is not None:
            update_data["university"] = user_update.university
        if user_update.description is not None:
            update_data["description"] = user_update.description
        if user_update.profile_picture is not None:
            update_data["profile_picture"] = user_update.profile_picture

        if not update_data:
            # If no fields to update, just return the current user
            user = await get_user(user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user

        # Update in Supabase
        result = supabase.table("users").update(update_data).eq("id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = result.data[0]
        # Ensure optional fields are handled correctly
        user_data.setdefault("university", None)
        user_data.setdefault("description", None)
        user_data.setdefault("profile_picture", None)
        
        return User(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating user: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error updating user: {str(e)}")

async def search_users(query: str, limit: int = 10) -> List[User]:
    """Search users by name"""
    try:
        if not query or len(query.strip()) < 2:
            return []
        
        # Use ilike for case-insensitive search in Supabase
        result = supabase.table("users").select("*").ilike("name", f"%{query.strip()}%").limit(limit).execute()
        
        users = []
        if result.data:
            for user_data in result.data:
                # Ensure optional fields are handled correctly
                user_data.setdefault("university", None)
                user_data.setdefault("description", None)
                user_data.setdefault("profile_picture", None)
                users.append(User(**user_data))
        
        return users
    except Exception as e:
        print(f"Error searching users: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error searching users: {str(e)}")