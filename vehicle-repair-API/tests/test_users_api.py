import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.anyio
async def test_create_and_get_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/users", json={"email":"j@j.com","name":"Jose"})
        assert r.status_code == 201
        user = r.json()
        gid = user["id"]
        r2 = await ac.get(f"/users/{gid}")
        assert r2.status_code == 200
        assert r2.json()["email"] == "j@j.com"
