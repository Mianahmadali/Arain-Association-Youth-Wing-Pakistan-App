from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.models import ContactCreate, ContactResponse, APIResponse, PaginatedResponse
from app.database import get_database
from app.auth import get_current_admin_user
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

contact_router = APIRouter()

@contact_router.post("/", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_contact_message(contact_data: ContactCreate):
    db = get_database()
    logger.info(f"Received contact data: {contact_data}")
    """Create a new contact message"""
    try:
        contact_dict = contact_data.dict()
        contact_dict['is_read'] = False
        contact_dict['created_at'] = datetime.utcnow()
        
        result = await db.contact_messages.insert_one(contact_dict)
        
        return APIResponse(
            success=True, 
            message="Contact message submitted successfully", 
            data={"id": str(result.inserted_id)}
        )
    except Exception as e:
        logger.error(f"Error creating contact message: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error submitting contact message"
        )

@contact_router.get("/", response_model=PaginatedResponse, status_code=status.HTTP_200_OK)
async def list_contact_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    is_read: Optional[bool] = Query(None),
    current_user = Depends(get_current_admin_user)
):
    db = get_database()
    """Get all contact messages (Admin only)"""
    try:
        query = {}
        if is_read is not None:
            query['is_read'] = is_read
            
        skip = (page - 1) * limit
        total_messages = await db.contact_messages.count_documents(query)
        messages = await db.contact_messages.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string for proper serialization
        serialized_messages = []
        for message in messages:
            message_dict = dict(message)
            message_dict['_id'] = str(message_dict['_id'])
            serialized_messages.append(message_dict)
        
        return PaginatedResponse(
            success=True,
            message="Contact messages retrieved successfully",
            data=serialized_messages,
            total=total_messages,
            page=page,
            limit=limit,
            total_pages=(total_messages // limit) + (1 if total_messages % limit != 0 else 0)
        )
    except Exception as e:
        logger.error(f"Error listing contact messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error retrieving contact messages"
        )

@contact_router.get("/{message_id}", response_model=ContactResponse, status_code=status.HTTP_200_OK)
async def get_contact_message(message_id: str, current_user = Depends(get_current_admin_user)):
    db = get_database()
    """Get a specific contact message by ID (Admin only)"""
    try:
        message = await db.contact_messages.find_one({"_id": ObjectId(message_id)})
        if message is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Contact message not found"
            )
        return ContactResponse(**message)
    except Exception as e:
        logger.error(f"Error retrieving contact message with ID {message_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error retrieving contact message"
        )

@contact_router.patch("/{message_id}/read", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def mark_message_as_read(message_id: str, current_user = Depends(get_current_admin_user)):
    db = get_database()
    """Mark a contact message as read (Admin only)"""
    try:
        result = await db.contact_messages.update_one(
            {"_id": ObjectId(message_id)}, 
            {"$set": {"is_read": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Contact message not found"
            )
            
        return APIResponse(success=True, message="Message marked as read")
    except Exception as e:
        logger.error(f"Error marking message as read with ID {message_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error updating message status"
        )

@contact_router.patch("/{message_id}/unread", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def mark_message_as_unread(message_id: str, current_user = Depends(get_current_admin_user)):
    db = get_database()
    """Mark a contact message as unread (Admin only)"""
    try:
        result = await db.contact_messages.update_one(
            {"_id": ObjectId(message_id)}, 
            {"$set": {"is_read": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Contact message not found"
            )
            
        return APIResponse(success=True, message="Message marked as unread")
    except Exception as e:
        logger.error(f"Error marking message as unread with ID {message_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error updating message status"
        )

@contact_router.delete("/{message_id}", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def delete_contact_message(message_id: str, current_user = Depends(get_current_admin_user)):
    db = get_database()
    """Delete a contact message (Admin only)"""
    try:
        result = await db.contact_messages.delete_one({"_id": ObjectId(message_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Contact message not found"
            )
            
        return APIResponse(success=True, message="Contact message deleted")
    except Exception as e:
        logger.error(f"Error deleting contact message with ID {message_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error deleting contact message"
        )

@contact_router.get("/stats/count", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def get_contact_stats(current_user = Depends(get_current_admin_user)):
    db = get_database()
    """Get contact message statistics (Admin only)"""
    try:
        total_messages = await db.contact_messages.count_documents({})
        unread_messages = await db.contact_messages.count_documents({"is_read": False})
        read_messages = await db.contact_messages.count_documents({"is_read": True})
        
        stats = {
            "total_messages": total_messages,
            "unread_messages": unread_messages,
            "read_messages": read_messages
        }
        
        return APIResponse(
            success=True, 
            message="Contact message statistics", 
            data=stats
        )
    except Exception as e:
        logger.error(f"Error getting contact statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error retrieving contact statistics"
        )
