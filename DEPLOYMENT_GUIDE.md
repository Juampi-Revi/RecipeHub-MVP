# RecipeHub Deployment & Environment Setup Guide

## 🚀 Overview

This guide covers the complete deployment process for RecipeHub, from local development setup to production deployment. The application consists of a Node.js backend API and a React frontend, with PostgreSQL as the database.

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

## 🛠️ Prerequisites

### System Requirements
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **PostgreSQL**: v14.x or higher
- **Git**: Latest version
- **Docker**: v24.x or higher (optional, for containerized deployment)

### Development Tools
- **Code Editor**: VS Code (recommended)
- **API Testing**: Postman or Insomnia
- **Database Client**: pgAdmin, DBeaver, or TablePlus

---

## 🏠 Local Development Setup

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/recipehub.git
cd recipehub

# Install root dependencies (if any)
npm install
```

### 2. Backend Setup

#### Environment Configuration
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Environment Variables (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/recipehub_dev"
DATABASE_URL_TEST="postgresql://username:password@localhost:5432/recipehub_test"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

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

# Logging
LOG_LEVEL="debug"
LOG_FILE="logs/app.log"
```

#### Database Setup
```bash
# Start PostgreSQL service
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux

# Create databases
createdb recipehub_dev
createdb recipehub_test

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed
```

#### Start Backend Server
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run start

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

### 3. Frontend Setup

#### Environment Configuration
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

#### Environment Variables (.env.local)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME="RecipeHub"
VITE_APP_VERSION="1.0.0"
VITE_APP_DESCRIPTION="Community Recipe Sharing Platform"

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false

# Development
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL="debug"

# File Upload
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"
```

#### Start Frontend Server
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 4. Full Stack Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database (optional)
psql -d recipehub_dev
```

---

## 🐳 Docker Development Setup

### Docker Compose Configuration
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: recipehub-postgres-dev
    environment:
      POSTGRES_DB: recipehub_dev
      POSTGRES_USER: recipehub
      POSTGRES_PASSWORD: recipehub123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/prisma/seed.sql:/docker-entrypoint-initdb.d/seed.sql
    networks:
      - recipehub-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: recipehub-backend-dev
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://recipehub:recipehub123@postgres:5432/recipehub_dev
      JWT_SECRET: dev-jwt-secret
      JWT_REFRESH_SECRET: dev-refresh-secret
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
    networks:
      - recipehub-network
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: recipehub-frontend-dev
    environment:
      VITE_API_BASE_URL: http://localhost:3001/api/v1
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - recipehub-network
    command: npm run dev

volumes:
  postgres_data:

networks:
  recipehub-network:
    driver: bridge
```

### Docker Development Commands
```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Rebuild services
docker-compose -f docker-compose.dev.yml up --build

# Run database migrations
docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate dev

# Access database
docker-compose -f docker-compose.dev.yml exec postgres psql -U recipehub -d recipehub_dev
```

---

## 🌐 Production Deployment

### 1. Environment Preparation

#### Production Environment Variables

**Backend (.env.production)**
```env
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database (use your production database URL)
DATABASE_URL="postgresql://username:password@your-db-host:5432/recipehub_prod"

# JWT (use strong, unique secrets)
JWT_SECRET="your-production-jwt-secret-256-bits-minimum"
JWT_REFRESH_SECRET="your-production-refresh-secret-256-bits-minimum"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS (your production domain)
FRONTEND_URL="https://your-domain.com"
ALLOWED_ORIGINS="https://your-domain.com,https://www.your-domain.com"

# Rate Limiting (stricter in production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Logging
LOG_LEVEL="info"
LOG_FILE="/var/log/recipehub/app.log"

# Security
HELMET_ENABLED=true
TRUST_PROXY=true
```

**Frontend (.env.production)**
```env
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
VITE_API_TIMEOUT=10000

VITE_APP_NAME="RecipeHub"
VITE_APP_VERSION="1.0.0"

# Feature Flags (enable in production)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Development (disable in production)
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL="error"
```

### 2. Database Migration
```bash
# Production database setup
npx prisma migrate deploy
npx prisma generate
npm run seed:prod  # Optional: seed with production data
```

### 3. Build Process
```bash
# Backend build
cd backend
npm ci --only=production
npm run build  # If using TypeScript

# Frontend build
cd frontend
npm ci
npm run build
```

---

## ☁️ Cloud Deployment Options

### Option 1: Vercel + Railway

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# VITE_API_BASE_URL=https://your-backend.railway.app/api/v1
```

#### Backend + Database (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway deploy

# Set environment variables in Railway dashboard
```

### Option 2: Heroku

#### Backend Deployment
```bash
# Create Heroku app
heroku create recipehub-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

#### Frontend Deployment
```bash
# Create frontend app
heroku create recipehub-frontend

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set VITE_API_BASE_URL=https://recipehub-api.herokuapp.com/api/v1

# Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

#### App Spec (app.yaml)
```yaml
name: recipehub
services:
- name: backend
  source_dir: /backend
  github:
    repo: yourusername/recipehub
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: JWT_SECRET
    value: your-production-secret

- name: frontend
  source_dir: /frontend
  github:
    repo: yourusername/recipehub
    branch: main
  build_command: npm run build
  run_command: npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_BASE_URL
    value: ${backend.PUBLIC_URL}/api/v1

databases:
- name: db
  engine: PG
  version: "14"
  size_slug: db-s-dev-database
```

### Option 4: AWS (Advanced)

#### Infrastructure as Code (CDK/Terraform)
```typescript
// aws-cdk/lib/recipehub-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export class RecipeHubStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'RecipeHubVPC', {
      maxAzs: 2
    });

    // RDS PostgreSQL
    const database = new rds.DatabaseInstance(this, 'RecipeHubDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret('recipehub'),
      multiAz: false,
      allocatedStorage: 20,
      deleteAutomatedBackups: false,
      deletionProtection: false
    });

    // ECS Cluster for Backend
    const cluster = new ecs.Cluster(this, 'RecipeHubCluster', {
      vpc
    });

    // S3 + CloudFront for Frontend
    const websiteBucket = new s3.Bucket(this, 'RecipeHubWebsite', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'RecipeHubDistribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: websiteBucket
        },
        behaviors: [{ isDefaultBehavior: true }]
      }]
    });
  }
}
```

---

## 🔧 Production Configuration

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/recipehub
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        root /var/www/recipehub/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'recipehub-backend',
    script: './backend/dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Monitoring & Logging

### Application Monitoring
```typescript
// backend/src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration.toFixed(2)}ms`);
  });
  
  next();
};
```

### Health Check Endpoints
```typescript
// backend/src/routes/health.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;
```

### Log Configuration
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'recipehub-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

---

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] Environment variables secured (no secrets in code)
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is comprehensive
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] HTTPS enforced in production
- [ ] Security headers configured (Helmet.js)
- [ ] File upload restrictions in place
- [ ] Error messages don't leak sensitive info

### Production Security
- [ ] SSL/TLS certificates installed
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting setup
- [ ] Incident response plan ready

---

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U username -d recipehub_dev

# Reset database
npx prisma migrate reset
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :3001
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Environment Variable Issues
```bash
# Check if variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Verify .env file location and syntax
cat .env | grep -v '^#' | grep -v '^$'
```

### Performance Issues
```bash
# Check memory usage
node --max-old-space-size=4096 server.js

# Profile application
node --inspect server.js

# Monitor database queries
# Enable Prisma query logging in development
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Monitoring setup complete
- [ ] Backup strategy implemented
- [ ] Rollback plan prepared

### Deployment
- [ ] Database migrated
- [ ] Backend deployed and healthy
- [ ] Frontend built and deployed
- [ ] DNS configured
- [ ] SSL working
- [ ] Health checks passing
- [ ] Monitoring active

### Post-Deployment
- [ ] Smoke tests completed
- [ ] Performance verified
- [ ] Error rates normal
- [ ] User acceptance testing
- [ ] Documentation updated
- [ ] Team notified

---

This comprehensive deployment guide ensures a smooth transition from development to production, with multiple deployment options to suit different needs and budgets. Choose the option that best fits your requirements and scale as needed.