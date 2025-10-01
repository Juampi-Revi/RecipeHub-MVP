# 🍳 RecipeHub - Complete Recipe Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

RecipeHub is a modern, full-stack recipe management platform that allows users to create, share, and discover delicious recipes. Built with cutting-edge technologies and following best practices for scalability, security, and user experience.

## 🚀 Quick Start (2 Commands Only!)

**Prerequisites:** Only [Docker](https://docs.docker.com/get-docker/) installed

```bash
# 1. Clone the repository
git clone git@github.com:Juampi-Revi/RecipeHub-MVP.git
# Or if you don't have SSH configured:
# git clone https://github.com/Juampi-Revi/RecipeHub-MVP.git

# If the directory already exists, remove it first:
# rm -rf RecipeHub-MVP && git clone git@github.com:Juampi-Revi/RecipeHub-MVP.git

cd RecipeHub-MVP

# 2. Start everything
make
```

**That's it!** 🎉

- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:3001 (or next available port)

> 🚀 **Smart Port Detection**: The application automatically detects and uses available ports, so you don't need to worry about port conflicts!

> 🗄️ **Auto Database Setup**: Database migrations and sample data are automatically applied on startup - no manual setup required!

### Other Commands
```bash
make stop    # Stop all services
make clean   # Stop and remove everything
make logs    # View logs
```

## 📋 Table of Contents

- [Quick Start](#-quick-start-2-commands-only)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Alternative Installation Methods](#-alternative-installation-methods)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration/Login** with JWT tokens
- **Multi-device Session Management** with refresh tokens
- **User Profile Management** with statistics
- **Password Security** with bcrypt hashing

### 🍳 Recipe Management
- **Create & Edit Recipes** with rich content
- **Recipe Categories** and ingredient management
- **Difficulty Levels** and cooking time tracking
- **Image Upload** support for recipes
- **Draft/Published** status management
- **Recipe Search** with advanced filtering

### 🌟 Social Features
- **Like/Unlike Recipes** with real-time counters
- **Comments & Ratings** system
- **Favorite Recipes** collection
- **User Recipe Collections** and sharing
- **Recipe Discovery** with personalized recommendations

### 🎨 Modern UI/UX
- **Responsive Design** for all devices
- **Dark/Light Theme** support
- **Intuitive Navigation** with breadcrumbs
- **Real-time Updates** with optimistic UI
- **Accessibility** compliant (WCAG 2.1)

### 🔧 Technical Features
- **RESTful API** with comprehensive endpoints
- **Dynamic Port Detection** - Automatic backend discovery and CORS configuration
- **Real-time Search** with debouncing
- **Pagination** for large datasets
- **Rate Limiting** and security headers
- **Error Handling** with user-friendly messages
- **Performance Optimization** with caching

## 🛠 Tech Stack

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation
- **Winston** - Logging

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible components
- **React Hook Form** - Form management
- **Framer Motion** - Animations

### DevOps & Tools
- **Docker & Docker Compose** - Containerization
- **ESLint & Prettier** - Code quality
- **Husky** - Git hooks
- **Jest & Testing Library** - Testing
- **GitHub Actions** - CI/CD (ready)

## 🔧 Alternative Installation Methods

### Option 1: Using Docker Compose Directly

If you prefer not to use the Makefile:

```bash
# Clone and setup
gh repo clone Juampi-Revi/RecipeHub-MVP
cd RecipeHub-MVP

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start with Docker Compose
chmod +x start.sh
./start.sh dev
```

### Option 2: Manual Installation (Advanced Users)

**Prerequisites:**
- [Node.js](https://nodejs.org/) (18.0+)
- [Docker](https://docs.docker.com/get-docker/) for database

```bash
# Clone repository
gh repo clone Juampi-Revi/RecipeHub-MVP
cd RecipeHub-MVP

# Start database only
docker compose up -d db

# Backend setup
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Option 3: Complete Manual Setup (No Docker)

**Prerequisites:**
- [Node.js](https://nodejs.org/) (18.0+)
- [PostgreSQL](https://www.postgresql.org/) (15.0+)
- [npm](https://www.npmjs.com/) (9.0+)

```bash
# 1. Clone repository
gh repo clone Juampi-Revi/RecipeHub-MVP
cd RecipeHub-MVP

# 2. Setup PostgreSQL database
createdb recipehub_dev

# 3. Backend setup
cd backend
npm install
cp .env.example .env

# Edit .env file with your PostgreSQL credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/recipehub_dev"

npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Optional: add sample data

# 4. Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env

# 5. Start servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## ⚙️ Environment Configuration

### Backend Environment Variables

Create `backend/.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/recipehub_dev"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis Configuration (Optional)
REDIS_URL="redis://localhost:6379"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload (if implemented)
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Email Configuration (for future features)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
# API Configuration
VITE_API_URL="http://localhost:3001/api"

# App Configuration
VITE_APP_NAME="RecipeHub"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false

# Upload Configuration
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"
```

### Production Environment

For production deployment, ensure you:

1. **Change all secrets** in environment variables
2. **Use strong passwords** for database and Redis
3. **Enable HTTPS** for both frontend and backend
4. **Configure proper CORS** origins
5. **Set up monitoring** and logging
6. **Configure backup** strategies

## 🗄️ Database Setup

### Using Prisma (Recommended)

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# View database in Prisma Studio
npx prisma studio
```

### Manual Database Setup

If you prefer to set up the database manually:

```sql
-- Create database
CREATE DATABASE recipehub_dev;

-- Create user (optional)
CREATE USER recipehub_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recipehub_dev TO recipehub_user;
```

### Database Seeding

```bash
# Seed with sample data
npx prisma db seed

# Reset database and seed
npx prisma migrate reset
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Using Docker (Recommended)
./start.sh dev

# Manual setup
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Production Mode

```bash
# Using Docker
./start.sh prod

# Manual setup
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && npm run build && npm start
```

### Available Scripts

#### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database
npm run db:studio   # Open Prisma Studio
```

#### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run test        # Run tests
npm run test:ui     # Run tests with UI
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run type-check  # TypeScript type checking
```

## 📚 API Documentation

### Interactive Documentation
- **API Specification**: [API_SPECIFICATION.md](./API_SPECIFICATION.md)
- **Health Check**: http://localhost:3001/api/health

### Quick API Overview

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

#### Recipe Endpoints
- `GET /api/recipes` - Get all recipes (with filters)
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/like` - Toggle like recipe

#### Other Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/ingredients` - Get all ingredients
- `GET /api/comments` - Get comments for recipe
- `POST /api/comments` - Create comment

### Testing API with cURL

```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get recipes
curl -X GET "http://localhost:3001/api/recipes?page=1&limit=10"
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Run all tests with coverage
npm run test:coverage
```

### Test Structure

```
backend/
├── src/
│   ├── __tests__/          # Unit tests
│   ├── routes/__tests__/   # Route tests
│   └── services/__tests__/ # Service tests
└── tests/
    ├── integration/        # Integration tests
    └── e2e/               # End-to-end tests

frontend/
├── src/
│   ├── components/__tests__/  # Component tests
│   ├── hooks/__tests__/       # Hook tests
│   └── utils/__tests__/       # Utility tests
└── e2e/                      # Playwright E2E tests
```

### Writing Tests

#### Backend Test Example
```typescript
// backend/src/routes/__tests__/auth.test.ts
import request from 'supertest';
import app from '../../app';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

#### Frontend Test Example
```typescript
// frontend/src/components/__tests__/RecipeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { RecipeCard } from '../RecipeCard';

describe('RecipeCard', () => {
  it('renders recipe information', () => {
    const recipe = {
      id: '1',
      title: 'Test Recipe',
      description: 'Test description'
    };
    
    render(<RecipeCard recipe={recipe} />);
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Deploy to production
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f
```

### Manual Deployment

#### Backend Deployment
```bash
# Build the application
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start dist/index.js --name recipehub-api

# Or start with node
node dist/index.js
```

#### Frontend Deployment
```bash
# Build for production
npm run build

# Serve with nginx, apache, or any static file server
# The build files will be in the 'dist' directory
```

### Environment-Specific Configurations

#### Staging Environment
```bash
# Use staging environment file
cp .env.staging .env

# Deploy with staging configuration
docker-compose -f docker-compose.staging.yml up -d
```

#### Production Environment
```bash
# Use production environment file
cp .env.production .env

# Deploy with production configuration
docker-compose -f docker-compose.yml up -d
```

## 📁 Project Structure

```
challenge_orderTob/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/            # Database models (Prisma)
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   └── app.ts             # Express app setup
│   ├── prisma/                # Database schema and migrations
│   ├── tests/                 # Test files
│   ├── Dockerfile             # Backend Docker configuration
│   └── package.json
├── frontend/                   # Frontend React app
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── atoms/         # Atomic design - atoms
│   │   │   ├── molecules/     # Atomic design - molecules
│   │   │   ├── organisms/     # Atomic design - organisms
│   │   │   └── templates/     # Atomic design - templates
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API services
│   │   ├── store/             # State management (Zustand)
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript types
│   │   └── App.tsx            # Main App component
│   ├── public/                # Static assets
│   ├── Dockerfile             # Frontend Docker configuration
│   └── package.json
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml      # Development Docker setup
├── start.sh                   # Convenience script for Docker
├── API_SPECIFICATION.md       # Complete API documentation
└── README.md                  # This file
```

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Caching)     │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards

- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Jest** for testing
- **Clean Architecture** principles

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add JWT refresh token functionality`
- `fix(recipes): resolve search filter bug`
- `docs(api): update endpoint documentation`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Reset database
npx prisma migrate reset
```

#### Port Already in Use
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean Docker system
docker system prune -a

# Rebuild containers
docker-compose down && docker-compose up --build
```

### Database Issues Troubleshooting

If you encounter database-related errors, try these manual commands:

```bash
# Apply migrations manually
docker exec recipehub-api-dev npx prisma migrate deploy

# Seed the database manually
docker exec recipehub-api-dev npx prisma db seed

# Reset database completely (if needed)
docker exec recipehub-api-dev npx prisma migrate reset --force
```

### Getting Help

- **Documentation**: Check this README and API_SPECIFICATION.md
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Performance Tips

1. **Use Redis** for caching in production
2. **Enable gzip** compression
3. **Optimize images** before uploading
4. **Use CDN** for static assets
5. **Monitor** application performance

---

## 🎉 Quick Start Summary

For the impatient developer:

```bash
# Clone and start with Docker
git clone <repo-url>
cd challenge_orderTob
chmod +x start.sh
./start.sh dev

# Access at http://localhost:3000
```

That's it! You now have a fully functional recipe management platform running locally.

---

**Built with ❤️ by the RecipeHub Team**