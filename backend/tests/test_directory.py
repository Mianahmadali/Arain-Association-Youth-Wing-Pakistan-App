import pytest
import asyncio
from httpx import AsyncClient
from app.main import app
from app.config import settings

@pytest.fixture
def client():
    return AsyncClient(app=app, base_url="http://test")

@pytest.fixture
def sample_directory_data():
    return {
        "full_name": "Test User",
        "father_name": "Test Father",
        "cnic": "12345-1234567-1",
        "gender": "male",
        "phone": "+923001234567",
        "email": "test@example.com",
        "qualification": "Masters",
        "profession": "Engineer",
        "city": "Lahore",
        "district": "Lahore",
        "province": "Punjab",
        "caste": "Arain",
        "marital_status": "single",
        "membership_type": "member"
    }

@pytest.mark.asyncio
async def test_create_directory_entry(client, sample_directory_data):
    response = await client.post("/api/directory/", json=sample_directory_data)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] == True
    assert "id" in data["data"]

@pytest.mark.asyncio
async def test_get_directory_entries(client):
    response = await client.get("/api/directory/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "data" in data

@pytest.mark.asyncio
async def test_directory_validation_error(client):
    invalid_data = {
        "full_name": "Test User",
        "cnic": "invalid-cnic",  # Invalid CNIC format
        "email": "invalid-email"  # Invalid email
    }
    response = await client.post("/api/directory/", json=invalid_data)
    assert response.status_code == 422  # Validation error

if __name__ == "__main__":
    pytest.main([__file__])
