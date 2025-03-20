# CygnusOne API Documentation

## Base URL
For local development: `http://localhost:5000`
For production: `[Your Heroku URL]`

## Authentication Endpoints

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Headers**: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

## Article Endpoints

### Get All Articles
- **URL**: `/api/articles`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 10)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "pagination": {
      "total": 2,
      "page": 1,
      "pages": 1
    },
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Sample Article",
        "content": "This is a sample article content",
        "author": {
          "_id": "60d0fe4f5311236168a109ca",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "tags": ["sample", "test"],
        "createdAt": "2023-03-15T12:00:00.000Z",
        "updatedAt": "2023-03-15T12:00:00.000Z"
      }
    ]
  }
  ```

### Get Single Article
- **URL**: `/api/articles/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Sample Article",
      "content": "This is a sample article content",
      "author": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "tags": ["sample", "test"],
      "createdAt": "2023-03-15T12:00:00.000Z",
      "updatedAt": "2023-03-15T12:00:00.000Z"
    }
  }
  ```

### Create Article
- **URL**: `/api/articles`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Headers**: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body**:
  ```json
  {
    "title": "New Article Title",
    "content": "Article content goes here...",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "New Article Title",
      "content": "Article content goes here...",
      "author": "60d0fe4f5311236168a109ca",
      "tags": ["tag1", "tag2"],
      "createdAt": "2023-03-15T12:00:00.000Z",
      "updatedAt": "2023-03-15T12:00:00.000Z"
    }
  }
  ```

### Update Article
- **URL**: `/api/articles/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Headers**: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body**:
  ```json
  {
    "title": "Updated Article Title",
    "content": "Updated content goes here...",
    "tags": ["tag1", "tag2", "tag3"]
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Updated Article Title",
      "content": "Updated content goes here...",
      "author": "60d0fe4f5311236168a109ca",
      "tags": ["tag1", "tag2", "tag3"],
      "createdAt": "2023-03-15T12:00:00.000Z",
      "updatedAt": "2023-03-15T13:00:00.000Z"
    }
  }
  ```

### Delete Article
- **URL**: `/api/articles/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Headers**: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Error Responses
All endpoints may return the following error responses:

- **400 Bad Request**
  ```json
  {
    "success": false,
    "message": "Error message details"
  }
  ```

- **401 Unauthorized**
  ```json
  {
    "success": false,
    "message": "Not authorized, no token"
  }
  ```

- **404 Not Found**
  ```json
  {
    "success": false,
    "message": "Resource not found"
  }
  ```

- **500 Server Error**
  ```json
  {
    "success": false,
    "message": "Server error message"
  }
  ```
