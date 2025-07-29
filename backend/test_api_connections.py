#!/usr/bin/env python3
"""
API Connection Test Script
Tests all main API endpoints to ensure proper backend connections
"""

import httpx
import asyncio
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

async def test_directory_endpoints():
    """Test directory registration and count endpoints"""
    print("🧪 Testing Directory Endpoints...")
    
    async with httpx.AsyncClient() as client:
        try:
            # Test directory count endpoint
            response = await client.get(f"{BASE_URL}/directory/count")
            print(f"✅ Directory Count: {response.status_code} - {response.json()}")
            
            # Test directory registration
            test_data = {
                "name": "Test User",
                "cnic": "12345-1234567-1",
                "gender": "male",
                "phone": "+923001234567",
                "email": "test@example.com",
                "city": "Lahore",
                "province": "Punjab",
                "profession": "Test Profession",
                "caste": "Test Caste",
                "membership_type": "member"
            }
            
            response = await client.post(f"{BASE_URL}/directory", json=test_data)
            print(f"✅ Directory Registration: {response.status_code} - {response.json()}")
            
        except Exception as e:
            print(f"❌ Directory Endpoints Error: {e}")

async def test_contact_endpoints():
    """Test contact form submission"""
    print("\n🧪 Testing Contact Endpoints...")
    
    async with httpx.AsyncClient() as client:
        try:
            test_contact = {
                "name": "Test Contact",
                "email": "test@example.com",
                "phone": "+923001234567",
                "subject": "Test Subject",
                "message": "This is a test message"
            }
            
            response = await client.post(f"{BASE_URL}/contact", json=test_contact)
            print(f"✅ Contact Form: {response.status_code} - {response.json()}")
            
        except Exception as e:
            print(f"❌ Contact Endpoints Error: {e}")

async def test_ai_agent_endpoints():
    """Test AI assistant chat endpoint"""
    print("\n🧪 Testing AI Agent Endpoints...")
    
    async with httpx.AsyncClient() as client:
        try:
            test_message = {
                "message": "Hello, can you help me register as a volunteer?",
                "session_id": None
            }
            
            response = await client.post(f"{BASE_URL}/agent/chat", json=test_message)
            print(f"✅ AI Chat: {response.status_code} - {response.json()}")
            
        except Exception as e:
            print(f"❌ AI Agent Endpoints Error: {e}")

async def test_health_check():
    """Test basic server health"""
    print("\n🧪 Testing Server Health...")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://localhost:8000/docs")
            print(f"✅ Server Health: {response.status_code} - API Documentation accessible")
            
        except Exception as e:
            print(f"❌ Server Health Error: {e}")

async def main():
    print("🚀 Starting API Connection Tests...")
    print("=" * 50)
    
    await test_health_check()
    await test_directory_endpoints()
    await test_contact_endpoints()
    await test_ai_agent_endpoints()
    
    print("\n" + "=" * 50)
    print("✅ API Connection Tests Complete!")
    print("\nNOTE: Make sure your backend server is running on http://localhost:8000")
    print("Run: python backend/run.py or cd backend && python run.py")

if __name__ == "__main__":
    asyncio.run(main())
