from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

database = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        database.client = AsyncIOMotorClient(settings.mongodb_url)
        database.database = database.client[settings.database_name]
        
        # Test the connection
        await database.client.admin.command('ping')
        logger.info(f"Connected to MongoDB database: {settings.database_name}")
        
        return database.database
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    try:
        if database.client:
            database.client.close()
            logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")

def get_database():
    """Get database instance"""
    return database.database
