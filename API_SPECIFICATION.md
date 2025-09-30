# RecipeHub API Specification

## 🌐 Base URL
```
Development: http://localhost:3001/api
Production: https://api.recipehub.com/api
```

## 🔐 Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🎯 Confirmed Technical Principles

- ✅ **SOLID principles** applied completely
- ✅ **Clean Architecture & Clean Code** 
- ✅ **All code in English** 
- ✅ **No unnecessary comments** 
- ✅ **React Hooks** 
- ✅ **Atomic Design** for reusable components 
- ✅ **Frontend only** for this first story 
- ✅ **No console.logs or unnecessary comments in the app**

---

## 📋 Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### POST /auth/logout
Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 🍳 Recipe Endpoints

### GET /recipes
Get list of recipes with filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 50) - Items per page
- `search` (string) - Search in title and description
- `category` (string) - Filter by category ID
- `difficulty` (string) - Filter by difficulty (easy|medium|hard)
- `prepTimeMin` (number) - Minimum preparation time in minutes
- `prepTimeMax` (number) - Maximum preparation time in minutes
- `ingredients` (string) - Comma-separated ingredient IDs
- `sortBy` (string) - Sort field (createdAt|title|prepTime|difficulty)
- `sortOrder` (string) - Sort order (asc|desc, default: desc)

**Example Request:**
```
GET /recipes?page=1&limit=10&category=dessert&difficulty=easy&sortBy=prepTime&sortOrder=asc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe-uuid-1",
        "title": "Chocolate Chip Cookies",
        "description": "Classic homemade chocolate chip cookies",
        "prepTime": 30,
        "difficulty": "easy",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "category": {
          "id": "category-uuid-1",
          "name": "Dessert"
        },
        "author": {
          "id": "user-uuid-1",
          "name": "Jane Smith"
        },
        "ingredientCount": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "category": "dessert",
      "difficulty": "easy",
      "sortBy": "prepTime",
      "sortOrder": "asc"
    }
  }
}
```

---

### GET /recipes/:id
Get detailed recipe information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "recipe-uuid-1",
      "title": "Chocolate Chip Cookies",
      "description": "Classic homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
      "prepTime": 30,
      "difficulty": "easy",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "category": {
        "id": "category-uuid-1",
        "name": "Dessert",
        "description": "Sweet treats and desserts"
      },
      "author": {
        "id": "user-uuid-1",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "ingredients": [
        {
          "id": "ingredient-uuid-1",
          "name": "All-purpose flour",
          "quantity": "2 cups"
        },
        {
          "id": "ingredient-uuid-2",
          "name": "Chocolate chips",
          "quantity": "1 cup"
        },
        {
          "id": "ingredient-uuid-3",
          "name": "Butter",
          "quantity": "1/2 cup"
        }
      ]
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Recipe not found"
}
```

---

### POST /recipes
Create a new recipe (Authentication required).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Homemade Pizza",
  "description": "Delicious homemade pizza with fresh ingredients",
  "prepTime": 45,
  "difficulty": "medium",
  "categoryId": "category-uuid-2",
  "ingredients": [
    {
      "ingredientId": "ingredient-uuid-4",
      "quantity": "2 cups"
    },
    {
      "name": "Mozzarella cheese",
      "quantity": "1 cup"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "recipe": {
      "id": "recipe-uuid-new",
      "title": "Homemade Pizza",
      "description": "Delicious homemade pizza with fresh ingredients",
      "prepTime": 45,
      "difficulty": "medium",
      "createdAt": "2024-01-15T11:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z",
      "category": {
        "id": "category-uuid-2",
        "name": "Main Course"
      },
      "author": {
        "id": "user-uuid-1",
        "name": "John Doe"
      },
      "ingredients": [
        {
          "id": "ingredient-uuid-4",
          "name": "Pizza dough",
          "quantity": "2 cups"
        },
        {
          "id": "ingredient-uuid-new",
          "name": "Mozzarella cheese",
          "quantity": "1 cup"
        }
      ]
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "prepTime",
      "message": "Preparation time must be a positive number"
    }
  ]
}
```

---

### PUT /recipes/:id
Update an existing recipe (Authentication required, owner only).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Homemade Pizza",
  "description": "Even more delicious homemade pizza with fresh ingredients",
  "prepTime": 50,
  "difficulty": "medium",
  "categoryId": "category-uuid-2",
  "ingredients": [
    {
      "ingredientId": "ingredient-uuid-4",
      "quantity": "2.5 cups"
    },
    {
      "ingredientId": "ingredient-uuid-5",
      "quantity": "1.5 cups"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipe updated successfully",
  "data": {
    "recipe": {
      "id": "recipe-uuid-1",
      "title": "Updated Homemade Pizza",
      "description": "Even more delicious homemade pizza with fresh ingredients",
      "prepTime": 50,
      "difficulty": "medium",
      "updatedAt": "2024-01-15T12:00:00Z",
      "category": {
        "id": "category-uuid-2",
        "name": "Main Course"
      },
      "ingredients": [
        {
          "id": "ingredient-uuid-4",
          "name": "Pizza dough",
          "quantity": "2.5 cups"
        },
        {
          "id": "ingredient-uuid-5",
          "name": "Mozzarella cheese",
          "quantity": "1.5 cups"
        }
      ]
    }
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You can only edit your own recipes"
}
```

---

### DELETE /recipes/:id
Delete a recipe (Authentication required, owner only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recipe deleted successfully"
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "You can only delete your own recipes"
}
```

---

## 🥕 Ingredient Endpoints

### GET /ingredients
Get list of all ingredients with optional search.

**Query Parameters:**
- `search` (string) - Search ingredient names
- `limit` (number, default: 100) - Maximum results

**Example Request:**
```
GET /ingredients?search=choc&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "ingredients": [
      {
        "id": "ingredient-uuid-1",
        "name": "Chocolate chips",
        "createdAt": "2024-01-10T09:00:00Z",
        "recipeCount": 15
      },
      {
        "id": "ingredient-uuid-2",
        "name": "Dark chocolate",
        "createdAt": "2024-01-10T09:00:00Z",
        "recipeCount": 8
      }
    ]
  }
}
```

---

### POST /ingredients
Create a new ingredient (Authentication required).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Organic vanilla extract"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ingredient created successfully",
  "data": {
    "ingredient": {
      "id": "ingredient-uuid-new",
      "name": "Organic vanilla extract",
      "createdAt": "2024-01-15T13:00:00Z"
    }
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Ingredient already exists"
}
```

---

## 📂 Category Endpoints

### GET /categories
Get list of all recipe categories.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category-uuid-1",
        "name": "Dessert",
        "description": "Sweet treats and desserts",
        "recipeCount": 25,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "category-uuid-2",
        "name": "Main Course",
        "description": "Primary dishes for lunch and dinner",
        "recipeCount": 40,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "category-uuid-3",
        "name": "Appetizer",
        "description": "Small dishes served before the main course",
        "recipeCount": 18,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 👤 User Endpoints

### GET /users/me
Get current user profile (Authentication required).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T10:00:00Z",
      "recipeCount": 12,
      "lastLoginAt": "2024-01-15T08:30:00Z"
    }
  }
}
```

---

### PUT /users/me
Update current user profile (Authentication required).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user-uuid-1",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "updatedAt": "2024-01-15T14:00:00Z"
    }
  }
}
```

---

### GET /users/me/recipes
Get current user's recipes (Authentication required).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sortBy` (string, default: createdAt)
- `sortOrder` (string, default: desc)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe-uuid-1",
        "title": "My Special Pasta",
        "description": "Family recipe for delicious pasta",
        "prepTime": 25,
        "difficulty": "easy",
        "createdAt": "2024-01-15T10:30:00Z",
        "category": {
          "id": "category-uuid-2",
          "name": "Main Course"
        },
        "ingredientCount": 6
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## ❌ Error Responses

### Standard Error Format
All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ],
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T15:00:00Z"
}
```

### Common HTTP Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Semantic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side errors |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `RESOURCE_CONFLICT` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server-side error |

---

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Recipe creation/update**: 10 requests per minute per user
- **General endpoints**: 100 requests per minute per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## 📄 Pagination

List endpoints support pagination with these parameters:

- `page`: Page number (starts from 1)
- `limit`: Items per page (max 50)

Pagination response format:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔍 Filtering and Sorting

### Recipe Filtering
- `search`: Text search in title and description
- `category`: Filter by category ID
- `difficulty`: Filter by difficulty level
- `prepTimeMin`/`prepTimeMax`: Filter by preparation time range
- `ingredients`: Filter by ingredient IDs (comma-separated)

### Sorting
- `sortBy`: Field to sort by (createdAt, title, prepTime, difficulty)
- `sortOrder`: Sort direction (asc, desc)

Example:
```
GET /recipes?search=pasta&difficulty=easy&sortBy=prepTime&sortOrder=asc
```

---

## 🧪 Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Get recipes:**
```bash
curl -X GET "http://localhost:3001/api/recipes?page=1&limit=5"
```

**Create a recipe:**
```bash
curl -X POST http://localhost:3001/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Recipe",
    "description": "A test recipe",
    "prepTime": 30,
    "difficulty": "easy",
    "categoryId": "category-uuid-1",
    "ingredients": [
      {
        "name": "Test Ingredient",
        "quantity": "1 cup"
      }
    ]
  }'
```

### Postman Collection
A complete Postman collection is available with pre-configured requests and environment variables for easy testing.

---

This API specification provides a complete reference for integrating with the RecipeHub backend. All endpoints include proper error handling, validation, and follow RESTful conventions.