# API Examples

This document provides detailed examples of how to use the REST API endpoints.

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication. After registering or logging in, you'll receive a JWT token. Include it in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

---

## Health Check

Check if the API is running.

**Endpoint:** `GET /health`

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Authentication Endpoints

### Register a New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Errors:**
- Email must be a valid email address
- Password must be at least 8 characters long

### Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password",
    "statusCode": 401
  }
}
```

---

## User Endpoints

### Get User Profile

Get the authenticated user's profile with their tasks.

**Endpoint:** `GET /api/users/me`

**Request:**
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "tasks": [
      {
        "id": 1,
        "title": "Buy groceries",
        "description": "Milk, bread, eggs",
        "completed": false,
        "createdAt": "2024-01-15T10:35:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z"
      }
    ]
  }
}
```

---

## Task Endpoints

All task endpoints require authentication.

### Create a Task

**Endpoint:** `POST /api/tasks`

**Request:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, bread, eggs"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false,
    "userId": 1,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Validation:**
- `title` is required (minimum 1 character)
- `description` is optional

### Get All Tasks

**Endpoint:** `GET /api/tasks`

**Request:**
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "title": "Write documentation",
      "description": null,
      "completed": false,
      "userId": 1,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    },
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": true,
      "userId": 1,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

### Filter Tasks by Status

**Endpoint:** `GET /api/tasks?completed=true` or `GET /api/tasks?completed=false`

**Request:**
```bash
# Get only completed tasks
curl "http://localhost:3000/api/tasks?completed=true" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get only incomplete tasks
curl "http://localhost:3000/api/tasks?completed=false" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": true,
      "userId": 1,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

### Get a Specific Task

**Endpoint:** `GET /api/tasks/:id`

**Request:**
```bash
curl http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "completed": false,
    "userId": 1,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "statusCode": 404
  }
}
```

**Error (403 Forbidden):**
When trying to access another user's task:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this task",
    "statusCode": 403
  }
}
```

### Update a Task

**Endpoint:** `PUT /api/tasks/:id`

All fields are optional. Only provided fields will be updated.

**Request:**
```bash
# Mark task as completed
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "completed": true
  }'

# Update title and description
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Buy groceries and cook dinner",
    "description": "Milk, bread, eggs, chicken"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries and cook dinner",
    "description": "Milk, bread, eggs, chicken",
    "completed": true,
    "userId": 1,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### Delete a Task

**Endpoint:** `DELETE /api/tasks/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

---

## Error Responses

### 400 Bad Request
Invalid input or validation error:
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "statusCode": 400
  }
}
```

### 401 Unauthorized
Missing or invalid authentication token:
```json
{
  "success": false,
  "error": {
    "message": "Invalid or missing authentication token",
    "statusCode": 401
  }
}
```

### 403 Forbidden
Trying to access resources belonging to another user:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this task",
    "statusCode": 403
  }
}
```

### 404 Not Found
Resource not found:
```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "statusCode": 404
  }
}
```

### 409 Conflict
Resource already exists (e.g., duplicate email):
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists",
    "statusCode": 409
  }
}
```

### 500 Internal Server Error
Unexpected server error:
```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

---

## Using with Postman

1. Import the API into Postman by accessing the Swagger documentation at `http://localhost:3000/docs`
2. Create an environment variable called `token`
3. After registering or logging in, save the token to the environment variable
4. Set up authorization to use `Bearer Token` with `{{token}}` as the value

## Using with curl and Environment Variables

Save your token to an environment variable for easier testing:

```bash
# Register and save token
export TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Now use $TOKEN in subsequent requests
curl http://localhost:3000/api/tasks -H "Authorization: Bearer $TOKEN"
```
