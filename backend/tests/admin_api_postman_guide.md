# Admin API Postman Guide

Base URL:

```text
http://127.0.0.1:5000/api/v1
```

Run the backend from `E:\gpt\gpt\backend`:

```powershell
uvicorn app.main:app --reload --port 5000
```

Before testing with the real database, run migrations:

```powershell
alembic upgrade head
```

## 1. Create User

Method:

```text
POST
```

URL:

```text
{{base_url}}/admin/users
```

Body:

```json
{
  "email": "user1@example.com",
  "username": "user_1",
  "full_name": "User One",
  "password": "password1",
  "token_limit": 10000,
  "start_date": "2026-06-01T00:00:00Z",
  "end_date": "2026-07-01T00:00:00Z"
}
```

Expected status:

```text
201 Created
```

Save this value from the response:

```text
user.id
```

You will use it as `{{user_id}}` in the next requests.

## 2. Login User

Method:

```text
POST
```

URL:

```text
{{base_url}}/auth/login
```

Body:

```json
{
  "email": "user1@example.com",
  "password": "password1"
}
```

Expected status:

```text
200 OK
```

## 3. Refresh Token

Method:

```text
POST
```

URL:

```text
{{base_url}}/auth/refresh
```

Body:

```text
No body (Uses HTTPOnly cookie 'refresh_token' set by Login)
```

Expected status:

```text
200 OK
```

## 4. Add Tokens

Method:

```text
PATCH
```

URL:

```text
{{base_url}}/admin/users/{{user_id}}/tokens
```

Body:

```json
{
  "tokens": 5000
}
```

Expected status:

```text
200 OK
```

The subscription `token_limit` should increase.

## 5. Renew Subscription

Method:

```text
PATCH
```

URL:

```text
{{base_url}}/admin/users/{{user_id}}/renew
```

Body:

```json
{
  "end_date": "2026-08-01T00:00:00Z"
}
```

Expected status:

```text
200 OK
```

The subscription `end_date` should update and `status` should be `active`.

## 6. Delete User

Method:

```text
DELETE
```

URL:

```text
{{base_url}}/admin/users/{{user_id}}
```

Body:

```text
No body
```

Expected status:

```text
200 OK
```

The user and related subscriptions are deleted because the database relationship uses cascade delete.

## 7. Get All Users

Method:

```text
GET
```

URL:

```text
{{base_url}}/admin/users
```

Body:

```text
No body
```

Expected status:

```text
200 OK
```

Returns a list of all users and their subscriptions for the admin dashboard.

## Common Validation Errors

Invalid dates:

```json
{
  "detail": "end_date must be after start_date."
}
```

Duplicate email:

```json
{
  "detail": "Email already exists."
}
```

Duplicate username:

```json
{
  "detail": "Username already exists."
}
```

Wrong login:

```json
{
  "detail": "Invalid email or password."
}
```

## Postman Variables

Create an environment with:

```text
base_url = http://127.0.0.1:5000/api/v1
user_id = paste user.id after create user
chat_id = paste chat_id after create chat
```

## 8. Create Chat

Method: `POST`  
URL: `{{base_url}}/chats`  
Headers: `Authorization: Bearer {{access_token}}`

Body:
```json
{
  "title": "My New Chat"
}
```
Expected status: `201 Created`

## 9. Get User Chats

Method: `GET`  
URL: `{{base_url}}/chats`  
Headers: `Authorization: Bearer {{access_token}}`

Expected status: `200 OK`

## 10. Send Message to Chat

Method: `POST`  
URL: `{{base_url}}/chats/{{chat_id}}/messages`  
Headers: `Authorization: Bearer {{access_token}}`

Body:
```json
{
  "role": "user",
  "content": "Hello AI!"
}
```
Expected status: `201 Created`

## 11. Get Chat Messages

Method: `GET`  
URL: `{{base_url}}/chats/{{chat_id}}/messages`  
Headers: `Authorization: Bearer {{access_token}}`

Expected status: `200 OK`

## 12. Rename Chat

Method: `PUT`  
URL: `{{base_url}}/chats/{{chat_id}}`  
Headers: `Authorization: Bearer {{access_token}}`

Body:
```json
{
  "title": "Updated Chat Title"
}
```
Expected status: `200 OK`

## 13. Delete Chat

Method: `DELETE`  
URL: `{{base_url}}/chats/{{chat_id}}`  
Headers: `Authorization: Bearer {{access_token}}`

Expected status: `200 OK`
