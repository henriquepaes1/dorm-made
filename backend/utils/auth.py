from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.password import verify_token
from typing import Annotated

security = HTTPBearer()

async def get_current_user_id(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]) -> str:
    """
    Dependency to extract and verify JWT token, returning the user ID.

    Args:
        credentials: HTTP Bearer token from request headers

    Returns:
        str: User ID from the JWT token

    Raises:
        HTTPException: If token is invalid or missing
    """
    try:
        user_id = verify_token(credentials.credentials)
        print(f"Auth received user_id: {user_id} (type: {type(user_id)})")
        # Return user_id as string (UUID)
        return str(user_id)
    except Exception as e:
        print(f"Error verifying token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(None)
) -> dict:
    """
    Dependency to verify that the user exists in the database.

    Args:
        user_id: User ID extracted from JWT token
        db: Database session

    Returns:
        dict: User data from database

    Raises:
        HTTPException: If user doesn't exist
    """
    from services.user_service import get_user_by_id
    from utils.database import get_db

    # Get database session if not provided
    if db is None:
        db_gen = get_db()
        db = next(db_gen)
        try:
            user = get_user_by_id(user_id, db)
        finally:
            db_gen.close()
    else:
        user = get_user_by_id(user_id, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user