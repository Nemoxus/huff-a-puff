import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from auth import get_current_user
from unittest.mock import patch, AsyncMock

# 1. Mock the Authentication Dependency
def override_get_current_user():
    return "testuser1"

app.dependency_overrides[get_current_user] = override_get_current_user

# 2. Setup our Async Pytest Marker
pytestmark = pytest.mark.asyncio

# --- THE TESTS ---

async def test_update_profile_unauthorized():
    """Test that removing the auth override correctly blocks the request."""
    app.dependency_overrides = {} 
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.put("/api/profile", data={"display_name": "Hacker"})
    
    # Expect a 401 Unauthorized because there is no token!
    assert response.status_code == 401

@patch("routers.users.users_collection")
async def test_update_profile_success(mock_users_collection):
    """Test that a valid user can update their display name and bio."""
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    # THE FIX: We use AsyncMock because the real code uses 'await' for these DB calls
    mock_users_collection.find_one = AsyncMock(return_value={"username": "testuser1"})
    mock_users_collection.update_one = AsyncMock(return_value=True)

    # Send the fake form data
    form_data = {
        "display_name": "Jonathan Ashwood",
        "bio": "Testing the backend!"
    }
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.put("/api/profile", data=form_data)
    
    # Assertions to prove our API works exactly as expected
    assert response.status_code == 200
    assert response.json()["message"] == "Profile updated successfully"
    assert "display_name" in response.json()["updated_fields"]
    assert "bio" in response.json()["updated_fields"]