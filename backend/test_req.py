import requests

login_resp = requests.post('http://localhost:5000/api/v1/auth/login', json={'email': 'admin@example.com', 'password': 'admin123'})
print("Login:", login_resp.json())
token = login_resp.json().get('access_token')

if token:
    headers = {'Authorization': f'Bearer {token}'}
    resp = requests.post('http://localhost:5000/api/v1/projects', headers=headers, json={'name': 'Al', 'description': 'gdbhr'})
    print("Create Project status:", resp.status_code)
    try:
        print("Create Project body:", resp.json())
    except:
        print("Create Project body:", resp.text)
