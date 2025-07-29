from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from datetime import timedelta
from app.models import UserCreate, UserLogin, UserResponse, Token, APIResponse, UserRole
from app.auth import (
    authenticate_user, 
    create_access_token, 
    get_password_hash, 
    get_user_by_email,
    get_current_user,
    get_current_admin_user
)
from app.config import settings
from app.database import get_database
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter()
security = HTTPBearer()

@auth_router.post("/register", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password and create user
        user_dict = user_data.dict()
        user_dict['password'] = get_password_hash(user_data.password)
        user_dict['is_active'] = True
        user_dict['created_at'] = datetime.utcnow()
        
        db = get_database()
        result = await db.users.insert_one(user_dict)
        
        return APIResponse(
            success=True,
            message="User registered successfully",
            data={"user_id": str(result.inserted_id)}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error registering user"
        )

@auth_router.post("/login", response_model=Token, status_code=status.HTTP_200_OK)
async def login_user(user_credentials: UserLogin):
    """Authenticate user and return JWT token"""
    try:
        user = await authenticate_user(user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is inactive"
            )
        
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": str(user["_id"])},
            expires_delta=access_token_expires
        )
        
        user_response = UserResponse(**user)
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error during login"
        )

@auth_router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@auth_router.patch("/me", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def update_current_user(
    full_name: str = None,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update current user information"""
    try:
        update_data = {}
        if full_name:
            update_data["full_name"] = full_name
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        db = get_database()
        result = await db.users.update_one(
            {"_id": current_user.id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return APIResponse(
            success=True,
            message="User information updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating user information"
        )

@auth_router.get("/users", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def list_users(
    page: int = 1,
    limit: int = 10,
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Get all users (Admin only)"""
    try:
        skip = (page - 1) * limit
        
        db = get_database()
        total_users = await db.users.count_documents({})
        users = await db.users.find({}, {"password": 0}).skip(skip).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user['_id'] = str(user['_id'])
        
        return APIResponse(
            success=True,
            message="Users retrieved successfully",
            data={
                "users": users,
                "total": total_users,
                "page": page,
                "limit": limit,
                "total_pages": (total_users // limit) + (1 if total_users % limit != 0 else 0)
            }
        )
        
    except Exception as e:
        logger.error(f"Error listing users: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error retrieving users"
        )

@auth_router.patch("/users/{user_id}/activate", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def activate_user(
    user_id: str,
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Activate a user account (Admin only)"""
    try:
        from bson import ObjectId
        
        db = get_database()
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return APIResponse(
            success=True,
            message="User account activated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error activating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error activating user account"
        )

@auth_router.patch("/users/{user_id}/deactivate", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def deactivate_user(
    user_id: str,
    current_user: UserResponse = Depends(get_current_admin_user)
):
    """Deactivate a user account (Admin only)"""
    try:
        from bson import ObjectId
        
        db = get_database()
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return APIResponse(
            success=True,
            message="User account deactivated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deactivating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error deactivating user account"
        )

@auth_router.get("/stats", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def get_auth_stats(current_user: UserResponse = Depends(get_current_admin_user)):
    """Get authentication statistics (Admin only)"""
    try:
        db = get_database()
        total_users = await db.users.count_documents({})
        active_users = await db.users.count_documents({"is_active": True})
        admin_users = await db.users.count_documents({"role": UserRole.ADMIN})
        member_users = await db.users.count_documents({"role": UserRole.MEMBER})
        
        stats = {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": total_users - active_users,
            "admin_users": admin_users,
            "member_users": member_users
        }
        
        return APIResponse(
            success=True,
            message="Authentication statistics",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error getting auth statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error retrieving authentication statistics"
        )
