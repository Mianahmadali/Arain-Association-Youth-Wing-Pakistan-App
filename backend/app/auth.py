from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.database import get_database
from app.models import UserResponse, UserRole
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer token
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

async def get_user_by_email(email: str):
    """Get user by email from database"""
    try:
        db = get_database()
        user = await db.users.find_one({"email": email})
        return user
    except Exception as e:
        logger.error(f"Error getting user by email: {e}")
        return None

async def get_user_by_id(user_id: str):
    """Get user by ID from database"""
    try:
        db = get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user
    except Exception as e:
        logger.error(f"Error getting user by ID: {e}")
        return None

async def authenticate_user(email: str, password: str):
    """Authenticate user credentials"""
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    return UserResponse(**user)

async def get_current_admin_user(current_user: UserResponse = Depends(get_current_user)):
    """Get current authenticated admin user"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

async def create_admin_user():
    """Create default admin user if it doesn't exist"""
    try:
        db = get_database()
        admin_exists = await db.users.find_one({"email": settings.admin_email})
        
        if not admin_exists:
            admin_user = {
                "email": settings.admin_email,
                "password": get_password_hash(settings.admin_password),
                "full_name": "System Administrator",
                "role": UserRole.ADMIN,
                "is_active": True,
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(admin_user)
            logger.info(f"Created admin user: {settings.admin_email}")
        else:
            logger.info("Admin user already exists")
            
    except Exception as e:
        logger.error(f"Error creating admin user: {e}")
        raise
