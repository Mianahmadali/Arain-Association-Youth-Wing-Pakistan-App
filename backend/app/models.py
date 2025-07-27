from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from enum import Enum
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class MaritalStatus(str, Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"
    WIDOWED = "widowed"

class BloodGroup(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class MembershipType(str, Enum):
    MEMBER = "member"
    VOLUNTEER = "volunteer"
    DONOR = "donor"

# Directory Models
class DirectoryCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    father_name: str = Field(..., min_length=2, max_length=100)
    cnic: str = Field(..., pattern=r'^\d{5}-\d{7}-\d{1}$')
    gender: Gender
    phone: str = Field(..., pattern=r'^\+92\d{10}$')
    email: EmailStr
    qualification: str = Field(..., min_length=2, max_length=100)
    profession: str = Field(..., min_length=2, max_length=100)
    city: str = Field(..., min_length=2, max_length=50)
    district: str = Field(..., min_length=2, max_length=50)
    province: str = Field(..., min_length=2, max_length=50)
    country: str = Field(default="Pakistan", max_length=50)
    blood_group: Optional[BloodGroup] = None
    caste: str = Field(..., min_length=2, max_length=50)  # Arain sub-caste
    marital_status: MaritalStatus
    membership_type: MembershipType = Field(default=MembershipType.MEMBER)
    notes: Optional[str] = Field(None, max_length=500)
    profile_image: Optional[str] = None  # URL to uploaded image

class DirectoryResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    full_name: str
    father_name: str
    cnic: str
    gender: Gender
    phone: str
    email: EmailStr
    qualification: str
    profession: str
    city: str
    district: str
    province: str
    country: str
    blood_group: Optional[BloodGroup]
    caste: str
    marital_status: MaritalStatus
    membership_type: MembershipType
    notes: Optional[str]
    profile_image: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}

class DirectoryUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    father_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^\+92\d{10}$')
    email: Optional[EmailStr] = None
    qualification: Optional[str] = Field(None, min_length=2, max_length=100)
    profession: Optional[str] = Field(None, min_length=2, max_length=100)
    city: Optional[str] = Field(None, min_length=2, max_length=50)
    district: Optional[str] = Field(None, min_length=2, max_length=50)
    province: Optional[str] = Field(None, min_length=2, max_length=50)
    blood_group: Optional[BloodGroup] = None
    caste: Optional[str] = Field(None, min_length=2, max_length=50)
    marital_status: Optional[MaritalStatus] = None
    membership_type: Optional[MembershipType] = None
    notes: Optional[str] = Field(None, max_length=500)
    profile_image: Optional[str] = None

# Contact Models
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+92\d{10}$')
    subject: str = Field(..., min_length=5, max_length=200)
    message: str = Field(..., min_length=10, max_length=1000)

class ContactResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    phone: str
    subject: str
    message: str
    is_read: bool = False
    created_at: datetime
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}

# User/Auth Models
class UserRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole = UserRole.MEMBER

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool = True
    created_at: datetime
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# AI Agent Models
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    suggested_actions: Optional[List[str]] = None

class ConversationResponse(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    session_id: str
    user_message: str
    ai_response: str
    timestamp: datetime
    user_info: Optional[dict] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}

# Generic Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class PaginatedResponse(BaseModel):
    success: bool
    message: str
    data: List[dict]
    total: int
    page: int
    limit: int
    total_pages: int

# Filter Models
class DirectoryFilter(BaseModel):
    city: Optional[str] = None
    profession: Optional[str] = None
    caste: Optional[str] = None
    province: Optional[str] = None
    gender: Optional[Gender] = None
    membership_type: Optional[MembershipType] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=100)
