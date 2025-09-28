from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.password import verify_token
from typing import Annotated

security = HTTPBearer()

async def get_current_user_id(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]) -> int:
    """
    Dependency to extract and verify JWT token, returning the user ID.

    Args:
        credentials: HTTP Bearer token from request headers

    Returns:
        int: User ID from the JWT token

    Raises:
        HTTPException: If token is invalid or missing
    """
    try:
        user_id = verify_token(credentials.credentials)
        return int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(user_id: Annotated[int, Depends(get_current_user_id)]) -> dict:
    """
    Dependency to verify that the user exists in the database.

    Args:
        user_id: User ID extracted from JWT token

    Returns:
        dict: User data from database

    Raises:
        HTTPException: If user doesn't exist
    """
    from services.user_service import get_user_by_id

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user