from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional, List
from app.models import ChatMessage, ChatResponse, ConversationResponse, APIResponse
from app.config import settings
from app.database import get_database
from app.auth import get_current_admin_user
import httpx
import uuid
import json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

agent_router = APIRouter()
db = get_database()

class AIAgent:
    def __init__(self):
        self.system_prompt = """
You are a helpful AI assistant for Arain Association Youth Wing Pakistan, an NGO focused on community welfare, education, and healthcare.

Your main responsibilities:
1. Help users with information about the organization
2. Guide users to fill out the Directory Registration form
3. Assist with Contact form submissions
4. Answer questions about our services: Education, Healthcare, Welfare Projects, Donations
5. Collect user information conversationally when they want to register

Key Information about Arain Association Youth Wing Pakistan:
- We provide educational scholarships and learning opportunities
- We organize free medical camps and healthcare services
- We run community welfare projects
- We accept donations to support our initiatives
- We have members, volunteers, and donors
- We focus on the Arain community but help everyone in need

When users want to register, collect this information conversationally:
- Full Name
- Father's Name
- CNIC (Pakistani ID format: 12345-1234567-1)
- Gender (male/female/other)
- Phone (Pakistani format: +92XXXXXXXXXX)
- Email
- Education/Qualification
- Profession
- City, District, Province
- Blood Group (optional)
- Caste/Baradari (Arain sub-caste)
- Marital Status
- Membership Type (member/volunteer/donor)

Always be helpful, respectful, and encouraging. Keep responses concise but informative.
"""
    
    async def get_ai_response(self, user_message: str, session_id: str) -> str:
        """Get response from OpenRouter AI API"""
        if not settings.openrouter_api_key:
            return self.get_fallback_response(user_message)
        
        try:
            headers = {
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": settings.ai_model,
                "messages": [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7,
                "max_tokens": 500
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions", 
                    headers=headers, 
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                    return self.get_fallback_response(user_message)
                    
        except Exception as e:
            logger.error(f"Error calling OpenRouter API: {e}")
            return self.get_fallback_response(user_message)
    
    def get_fallback_response(self, user_message: str) -> str:
        """Fallback responses when AI API is not available"""
        message_lower = user_message.lower()
        
        if any(word in message_lower for word in ['volunteer', 'join', 'register', 'directory']):
            return """Thank you for your interest in joining Arain Association Youth Wing Pakistan! 
            
To register as a member/volunteer, I'll need some information from you:
            
1. Your full name
2. Father's name
3. CNIC number
4. Contact details (phone & email)
5. Education and profession
6. Location (city, district, province)
            
Would you like to start the registration process? Please share your full name first."""
        
        elif any(word in message_lower for word in ['contact', 'help', 'support']):
            return """I'm here to help! You can:
            
1. Register as a member/volunteer/donor
2. Get information about our services
3. Submit a contact message
4. Learn about our welfare projects
            
What would you like to know more about?"""
        
        elif any(word in message_lower for word in ['education', 'scholarship', 'study']):
            return """Arain Association Youth Wing Pakistan provides:
            
📚 Educational scholarships for deserving students
📖 Learning centers and educational resources
🎓 Career guidance and mentorship
📝 Educational workshops and training
            
Would you like to know more about our educational programs or apply for support?"""
        
        elif any(word in message_lower for word in ['health', 'medical', 'healthcare']):
            return """Our healthcare services include:
            
🏥 Free medical camps in underserved areas
💊 Basic healthcare services
🩺 Health awareness programs
🚑 Emergency medical assistance
            
We organize regular medical camps. Would you like information about upcoming camps?"""
        
        elif any(word in message_lower for word in ['donate', 'donation', 'contribute']):
            return """Thank you for considering a donation to support our cause!
            
Your contributions help us:
✅ Provide educational scholarships
✅ Organize medical camps
✅ Run community welfare projects
✅ Support families in need
            
Would you like to know more about donation methods or submit a contact form?"""
        
        else:
            return """Hello! I'm here to help you with Arain Association Youth Wing Pakistan.
            
I can assist you with:
🔹 Joining as a member/volunteer/donor
🔹 Information about our services
🔹 Educational programs and scholarships
🔹 Healthcare services and medical camps
🔹 Donation and contribution options
            
How can I help you today?"""
    
    def get_suggested_actions(self, user_message: str, ai_response: str) -> List[str]:
        """Get suggested actions based on conversation context"""
        message_lower = user_message.lower()
        response_lower = ai_response.lower()
        
        suggestions = []
        
        if 'register' in response_lower or 'join' in response_lower:
            suggestions.extend(["Start Registration", "Learn More About Membership"])
        
        if 'contact' in response_lower:
            suggestions.append("Submit Contact Form")
        
        if 'education' in response_lower or 'scholarship' in response_lower:
            suggestions.append("View Educational Programs")
        
        if 'medical' in response_lower or 'health' in response_lower:
            suggestions.append("Find Medical Camps")
        
        if 'donate' in response_lower:
            suggestions.append("Make a Donation")
        
        # Default suggestions if none match
        if not suggestions:
            suggestions = ["Join Directory", "Contact Us", "Learn More"]
        
        return suggestions[:3]  # Limit to 3 suggestions

ai_agent = AIAgent()

@agent_router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_ai(chat_message: ChatMessage):
    """Chat with AI assistant"""
    try:
        session_id = chat_message.session_id or str(uuid.uuid4())
        
        # Get AI response
        ai_response = await ai_agent.get_ai_response(chat_message.message, session_id)
        
        # Get suggested actions
        suggested_actions = ai_agent.get_suggested_actions(chat_message.message, ai_response)
        
        # Store conversation in database
        conversation_data = {
            "session_id": session_id,
            "user_message": chat_message.message,
            "ai_response": ai_response,
            "timestamp": datetime.utcnow(),
            "user_info": None  # Can be enhanced to store user context
        }
        
        await db.conversations.insert_one(conversation_data)
        
        return ChatResponse(
            response=ai_response,
            session_id=session_id,
            suggested_actions=suggested_actions
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        # Return fallback response even if database fails
        fallback_response = ai_agent.get_fallback_response(chat_message.message)
        return ChatResponse(
            response=fallback_response,
            session_id=chat_message.session_id or str(uuid.uuid4()),
            suggested_actions=["Join Directory", "Contact Us", "Learn More"]
        )

@agent_router.get("/conversations", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def get_conversations(
    session_id: Optional[str] = None,
    limit: int = 50,
    current_user = Depends(get_current_admin_user)
):
    """Get conversation history (Admin only)"""
    try:
        query = {}
        if session_id:
            query["session_id"] = session_id
        
        conversations = await db.conversations.find(query).sort("timestamp", -1).limit(limit).to_list(length=limit)
        
        return APIResponse(
            success=True,
            message="Conversations retrieved successfully",
            data={"conversations": conversations}
        )
        
    except Exception as e:
        logger.error(f"Error retrieving conversations: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error retrieving conversations"
        )

@agent_router.get("/conversations/stats", response_model=APIResponse, status_code=status.HTTP_200_OK)
async def get_conversation_stats(current_user = Depends(get_current_admin_user)):
    """Get conversation statistics (Admin only)"""
    try:
        total_conversations = await db.conversations.count_documents({})
        unique_sessions = len(await db.conversations.distinct("session_id"))
        
        # Get conversations from last 24 hours
        from datetime import timedelta
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_conversations = await db.conversations.count_documents({
            "timestamp": {"$gte": yesterday}
        })
        
        stats = {
            "total_conversations": total_conversations,
            "unique_sessions": unique_sessions,
            "recent_conversations_24h": recent_conversations
        }
        
        return APIResponse(
            success=True,
            message="Conversation statistics",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error getting conversation stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error retrieving conversation statistics"
        )
