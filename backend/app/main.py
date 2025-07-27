import logging
import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.auth import create_admin_user
from app.routers import directory, contact, agent, auth

logger = logging.getLogger("uvicorn.error")
app = FastAPI(title=settings.app_name, version=settings.app_version, debug=settings.debug)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Start-up and shutdown events
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up...")
    await connect_to_mongo()
    await create_admin_user()
    logger.info("Startup complete.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down...")
    await close_mongo_connection()
    logger.info("Shutdown complete.")

# Routers
app.include_router(directory.directory_router, prefix="/api/directory", tags=["Directory"])
app.include_router(contact.contact_router, prefix="/api/contact", tags=["Contact"])
app.include_router(agent.agent_router, prefix="/api/agent", tags=["AI Agent"])
app.include_router(auth.auth_router, prefix="/api/auth", tags=["Authentication"])

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
