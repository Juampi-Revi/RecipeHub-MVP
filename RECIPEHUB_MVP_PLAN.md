# RecipeHub MVP - Complete Development Plan

## 🎯 Project Overview

**RecipeHub** is a community-driven recipe sharing platform with a REST API backend (Node.js + TypeScript + PostgreSQL) and a modern React frontend (React 18 + TypeScript + Tailwind CSS).

### Core Value Proposition
- **Community-driven**: Users can share and discover recipes
- **Authenticated content creation**: Only registered users can create/edit recipes
- **Public discovery**: Anyone can browse and search recipes
- **Rich relationships**: Complex data relationships between users, recipes, ingredients, and categories

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

## 📋 User Stories by Epic

### Epic 1: Authentication & User Management

#### US-001: User Registration
**As a** visitor  
**I want to** create an account with email and password  
**So that** I can share my own recipes with the community  

**Acceptance Criteria:**
- User can register with name, email, and password
- Email must be unique and valid format
- Password must meet security requirements (min 8 chars, special chars)
- User receives confirmation of successful registration
- User is automatically logged in after registration

**Frontend Pages:**
- `/register` - Registration form
- Redirect to `/dashboard` after successful registration

---

#### US-002: User Login
**As a** registered user  
**I want to** log in with my credentials  
**So that** I can access my personal recipe management features  

**Acceptance Criteria:**
- User can login with email and password
- Invalid credentials show appropriate error message
- Successful login redirects to dashboard
- JWT token is stored securely for subsequent requests
- Remember me option for extended sessions

**Frontend Pages:**
- `/login` - Login form
- Redirect to `/dashboard` after successful login

---

#### US-003: Token Refresh
**As a** logged-in user  
**I want** my session to be automatically renewed  
**So that** I don't get logged out while actively using the app  

**Acceptance Criteria:**
- JWT tokens are automatically refreshed before expiration
- User stays logged in during active usage
- Expired sessions redirect to login page
- Refresh token rotation for security

---

### Epic 2: Recipe Discovery (Public)

#### US-004: Browse All Recipes
**As a** visitor or user  
**I want to** see a list of all available recipes  
**So that** I can discover new cooking ideas  

**Acceptance Criteria:**
- Display recipes in a grid/list layout
- Show recipe title, image, prep time, difficulty, and author
- Implement pagination (20 recipes per page)
- Responsive design for mobile and desktop
- Loading states and error handling

**Frontend Pages:**
- `/` - Homepage with featured recipes
- `/recipes` - Complete recipe listing

---

#### US-005: Recipe Detail View
**As a** visitor or user  
**I want to** see complete recipe details  
**So that** I can follow the cooking instructions  

**Acceptance Criteria:**
- Display full recipe information (title, description, prep time, difficulty)
- Show complete ingredients list with quantities
- Display recipe category and author information
- Responsive layout with clear typography
- Back navigation to recipe list

**Frontend Pages:**
- `/recipes/:id` - Individual recipe detail page

---

#### US-006: Filter and Search Recipes
**As a** visitor or user  
**I want to** filter recipes by various criteria  
**So that** I can find recipes that match my preferences  

**Acceptance Criteria:**
- Filter by category (dropdown)
- Filter by difficulty level (easy/medium/hard)
- Filter by preparation time (ranges: <30min, 30-60min, >60min)
- Filter by ingredients (multi-select)
- Search by recipe title (text input)
- Combine multiple filters
- Clear all filters option
- URL reflects current filters for sharing

**Frontend Pages:**
- `/recipes` with filter sidebar
- `/recipes?category=dessert&difficulty=easy` - Filtered results

---

### Epic 3: Recipe Management (Authenticated)

#### US-007: Create New Recipe
**As a** logged-in user  
**I want to** create and publish a new recipe  
**So that** I can share my cooking knowledge with others  

**Acceptance Criteria:**
- Multi-step form: Basic info → Ingredients → Instructions
- Required fields: title, description, prep time, difficulty, category
- Add multiple ingredients with quantities
- Select from existing ingredients or create new ones
- Form validation with clear error messages
- Save as draft option
- Preview before publishing

**Frontend Pages:**
- `/recipes/new` - Recipe creation form
- `/recipes/new/ingredients` - Ingredients step
- `/recipes/new/preview` - Preview before publishing

---

#### US-008: Edit My Recipes
**As a** logged-in user  
**I want to** edit my published recipes  
**So that** I can improve them or fix mistakes  

**Acceptance Criteria:**
- Only recipe author can edit their recipes
- Pre-populate form with existing data
- Same validation as creation
- Update ingredients and categories
- Version history (optional)
- Publish changes immediately

**Frontend Pages:**
- `/recipes/:id/edit` - Edit recipe form
- `/dashboard/my-recipes` - List of user's recipes with edit links

---

#### US-009: Delete My Recipes
**As a** logged-in user  
**I want to** delete recipes I no longer want to share  
**So that** I can manage my content  

**Acceptance Criteria:**
- Only recipe author can delete their recipes
- Confirmation dialog before deletion
- Soft delete with recovery option (optional)
- Remove from all public listings immediately

**Frontend Pages:**
- Delete action available in `/dashboard/my-recipes`
- Confirmation modal

---

#### US-010: My Recipe Dashboard
**As a** logged-in user  
**I want to** see all my published recipes in one place  
**So that** I can easily manage my content  

**Acceptance Criteria:**
- List all user's recipes with thumbnails
- Show recipe stats (views, creation date)
- Quick actions: edit, delete, view public page
- Search within my recipes
- Sort by date, title, or popularity

**Frontend Pages:**
- `/dashboard` - User dashboard overview
- `/dashboard/my-recipes` - Detailed recipe management

---

### Epic 4: Content Management

#### US-011: Manage Ingredients
**As a** logged-in user  
**I want to** add new ingredients to the system  
**So that** I can use them in my recipes  

**Acceptance Criteria:**
- Add new ingredients when creating recipes
- Autocomplete from existing ingredients
- Prevent duplicate ingredients
- Standardized ingredient names

**Frontend Pages:**
- Ingredient management within recipe forms
- `/admin/ingredients` - Ingredient management (optional)

---

#### US-012: Browse Categories
**As a** visitor or user  
**I want to** see all available recipe categories  
**So that** I can explore recipes by type  

**Acceptance Criteria:**
- Display all categories with recipe counts
- Click category to filter recipes
- Visual category cards with icons/images

**Frontend Pages:**
- `/categories` - Category listing
- Category filter in `/recipes`

---

### Epic 5: Enhanced User Experience

#### US-013: Responsive Design
**As a** user on any device  
**I want** the application to work well on mobile, tablet, and desktop  
**So that** I can access recipes anywhere  

**Acceptance Criteria:**
- Mobile-first responsive design
- Touch-friendly interface on mobile
- Optimized layouts for different screen sizes
- Fast loading on mobile networks

---

#### US-014: Loading States and Error Handling
**As a** user  
**I want** clear feedback when actions are processing or fail  
**So that** I understand what's happening  

**Acceptance Criteria:**
- Loading spinners for async operations
- Error messages for failed requests
- Retry mechanisms for failed operations
- Offline state detection

---

## 🏗️ Technical Architecture

### Backend Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context + useReducer (or Zustand)
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest + React Testing Library

### Project Structure
```
recipehub/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Prisma schema and types
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── app.ts           # Express app setup
│   ├── prisma/              # Database schema and migrations
│   ├── tests/               # API tests
│   └── package.json
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API calls
│   │   ├── context/         # React Context providers
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
└── README.md                # Project documentation
```

---

## 🗄️ Database Schema

### Core Tables
```sql
-- Users table
users (
  id: UUID PRIMARY KEY,
  name: VARCHAR(100) NOT NULL,
  email: VARCHAR(255) UNIQUE NOT NULL,
  password_hash: VARCHAR(255) NOT NULL,
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
);

-- Categories table
categories (
  id: UUID PRIMARY KEY,
  name: VARCHAR(50) UNIQUE NOT NULL,
  description: TEXT,
  created_at: TIMESTAMP DEFAULT NOW()
);

-- Recipes table
recipes (
  id: UUID PRIMARY KEY,
  title: VARCHAR(200) NOT NULL,
  description: TEXT NOT NULL,
  prep_time: INTEGER NOT NULL, -- minutes
  difficulty: ENUM('easy', 'medium', 'hard') NOT NULL,
  category_id: UUID REFERENCES categories(id),
  created_by: UUID REFERENCES users(id),
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
);

-- Ingredients table
ingredients (
  id: UUID PRIMARY KEY,
  name: VARCHAR(100) UNIQUE NOT NULL,
  created_at: TIMESTAMP DEFAULT NOW()
);

-- Recipe-Ingredients junction table
recipe_ingredients (
  id: UUID PRIMARY KEY,
  recipe_id: UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id: UUID REFERENCES ingredients(id),
  quantity: VARCHAR(50), -- "2 cups", "1 tbsp", etc.
  UNIQUE(recipe_id, ingredient_id)
);
```

### Relationships
- User → Recipe: One-to-Many (user can create multiple recipes)
- Recipe → Category: Many-to-One (recipe belongs to one category)
- Recipe ↔ Ingredient: Many-to-Many (through recipe_ingredients)

---

## 🛣️ API Endpoints Specification

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Recipe Endpoints
```
GET    /api/recipes              # List recipes with filters
GET    /api/recipes/:id          # Get recipe details
POST   /api/recipes              # Create recipe (auth required)
PUT    /api/recipes/:id          # Update recipe (auth + ownership)
DELETE /api/recipes/:id          # Delete recipe (auth + ownership)
```

### Ingredient Endpoints
```
GET    /api/ingredients          # List all ingredients
POST   /api/ingredients          # Create ingredient (auth required)
```

### Category Endpoints
```
GET    /api/categories           # List all categories
```

### User Endpoints
```
GET    /api/users/me             # Get current user profile
GET    /api/users/me/recipes     # Get current user's recipes
```

---

## 🎨 Frontend Route Structure

```
/                                # Homepage with featured recipes
/login                          # Login form
/register                       # Registration form
/recipes                        # Recipe listing with filters
/recipes/:id                    # Recipe detail page
/recipes/new                    # Create new recipe (auth required)
/recipes/:id/edit               # Edit recipe (auth + ownership)
/categories                     # Category listing
/categories/:id                 # Recipes by category
/dashboard                      # User dashboard (auth required)
/dashboard/my-recipes           # User's recipe management
/profile                        # User profile settings
```

### Protected Routes
- `/recipes/new`
- `/recipes/:id/edit`
- `/dashboard/*`
- `/profile`

---

## 📱 Component Hierarchy

### Shared Components
```
components/
├── ui/                         # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── LoadingSpinner.tsx
├── layout/                     # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Layout.tsx
├── forms/                      # Form components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── RecipeForm.tsx
│   └── IngredientSelector.tsx
└── recipe/                     # Recipe-specific components
    ├── RecipeCard.tsx
    ├── RecipeList.tsx
    ├── RecipeDetail.tsx
    ├── RecipeFilters.tsx
    └── IngredientList.tsx
```

### Page Components
```
pages/
├── HomePage.tsx
├── LoginPage.tsx
├── RegisterPage.tsx
├── RecipesPage.tsx
├── RecipeDetailPage.tsx
├── CreateRecipePage.tsx
├── EditRecipePage.tsx
├── CategoriesPage.tsx
├── DashboardPage.tsx
└── ProfilePage.tsx
```

---

This is the foundation document. Would you like me to continue with the detailed commit-by-commit development roadmap?