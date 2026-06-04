import asyncio
import aiohttp
import json

async def test_create_project():
    async with aiohttp.ClientSession() as session:
        async with session.post('http://localhost:5000/api/v1/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'}) as resp:
            data = await resp.json()
            token = data.get('access_token')
            print("Login:", data)
            
        if token:
            # Create project
            headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
            async with session.post('http://localhost:5000/api/v1/projects', headers=headers, json={'name': 'Al', 'description': 'gdbhr'}) as resp:
                print("Create Project status:", resp.status)
                print("Create Project response:", await resp.text())

asyncio.run(test_create_project())
