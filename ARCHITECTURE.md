# RecipeHub - Documentación de Arquitectura

## Índice
1. [Visión General de la Arquitectura](#visión-general-de-la-arquitectura)
2. [Arquitectura del Backend](#arquitectura-del-backend)
3. [Arquitectura del Frontend](#arquitectura-del-frontend)
4. [Base de Datos](#base-de-datos)
5. [Flujo de Datos](#flujo-de-datos)
6. [Seguridad](#seguridad)
7. [Escalabilidad](#escalabilidad)
8. [Patrones de Diseño](#patrones-de-diseño)

## Visión General de la Arquitectura

RecipeHub sigue una arquitectura de **separación de responsabilidades** con un backend API RESTful y un frontend SPA (Single Page Application), implementando el patrón **Cliente-Servidor** con las siguientes características:

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│                 │ ◄──────────────► │                 │
│   Frontend      │                  │   Backend       │
│   (React SPA)   │                  │   (Node.js API) │
│                 │                  │                 │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ Prisma ORM
                                              ▼
                                     ┌─────────────────┐
                                     │                 │
                                     │   PostgreSQL    │
                                     │   Database      │
                                     │                 │
                                     └─────────────────┘
```

### Principios Arquitectónicos

1. **Separación de Responsabilidades**: Frontend maneja UI/UX, Backend maneja lógica de negocio
2. **API First**: El backend expone una API RESTful bien documentada
3. **Stateless**: El backend es stateless, usando JWT para autenticación
4. **Modularidad**: Código organizado en módulos reutilizables
5. **Escalabilidad**: Diseño preparado para crecimiento horizontal

## Arquitectura del Backend

### Estructura de Capas

El backend sigue una **arquitectura en capas** (Layered Architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Routes    │  │ Controllers │  │ Middleware  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Business Logic Layer                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Services   │  │ Validation  │  │   Utils     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Prisma ORM  │  │   Models    │  │ Migrations  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                       │
│                    PostgreSQL                           │
└─────────────────────────────────────────────────────────┘
```

### Componentes del Backend

#### 1. **Presentation Layer**

- **Routes** (`src/routes/`): Define los endpoints de la API
  - `auth.ts`: Autenticación y autorización
  - `recipes.ts`: Gestión de recetas
  - `categories.ts`: Gestión de categorías
  - `ingredients.ts`: Gestión de ingredientes
  - `health.ts`: Health checks y monitoreo

- **Controllers** (`src/controllers/`): Manejan las peticiones HTTP
  - `authController.ts`: Lógica de autenticación
  - `recipeController.ts`: CRUD de recetas
  - `categoryController.ts`: CRUD de categorías
  - `ingredientController.ts`: CRUD de ingredientes

- **Middleware** (`src/middleware/`): Funciones intermedias
  - `auth.ts`: Verificación de JWT
  - `validation.ts`: Validación de datos de entrada
  - `errorHandler.ts`: Manejo centralizado de errores
  - `rateLimiter.ts`: Limitación de velocidad

#### 2. **Business Logic Layer**

- **Services** (`src/services/`): Lógica de negocio
  - `recipeService.ts`: Operaciones complejas de recetas
  - `authService.ts`: Lógica de autenticación
  - `emailService.ts`: Envío de emails
  - `imageService.ts`: Procesamiento de imágenes

- **Validation** (`src/validation/`): Esquemas de validación
  - Uso de Joi/Zod para validación de datos
  - Validación de tipos TypeScript

#### 3. **Data Access Layer**

- **Prisma ORM**: Abstracción de base de datos
- **Models**: Definidos en `schema.prisma`
- **Migrations**: Control de versiones de BD

### Patrones Implementados

1. **Repository Pattern**: A través de Prisma ORM
2. **Dependency Injection**: Para servicios y utilidades
3. **Middleware Pattern**: Para funcionalidades transversales
4. **Error Handling Pattern**: Manejo centralizado de errores

## Arquitectura del Frontend

### Estructura de Componentes

El frontend sigue una **arquitectura basada en componentes** con React:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Pages    │  │ Components  │  │   Layouts   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    State Management Layer               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Context   │  │   Hooks     │  │   Stores    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ API Client  │  │   Utils     │  │ Validators  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Componentes del Frontend

#### 1. **Presentation Layer**

- **Pages** (`src/pages/`): Componentes de página completa
  - `Home.tsx`: Página principal
  - `Login.tsx`: Autenticación
  - `RecipeDetail.tsx`: Detalle de receta
  - `Profile.tsx`: Perfil de usuario

- **Components** (`src/components/`): Componentes reutilizables
  - `common/`: Componentes genéricos (Button, Input, Modal)
  - `recipe/`: Componentes específicos de recetas
  - `auth/`: Componentes de autenticación
  - `layout/`: Componentes de layout (Header, Footer, Sidebar)

- **Layouts** (`src/layouts/`): Estructuras de página
  - `MainLayout.tsx`: Layout principal con navegación
  - `AuthLayout.tsx`: Layout para páginas de autenticación

#### 2. **State Management Layer**

- **Context API**: Para estado global
  - `AuthContext`: Estado de autenticación
  - `ThemeContext`: Tema de la aplicación
  - `NotificationContext`: Notificaciones

- **Custom Hooks** (`src/hooks/`): Lógica reutilizable
  - `useAuth.ts`: Hook de autenticación
  - `useApi.ts`: Hook para llamadas API
  - `useLocalStorage.ts`: Persistencia local

#### 3. **Service Layer**

- **API Client** (`src/services/api.ts`): Cliente HTTP
  - Configuración de Axios
  - Interceptores para autenticación
  - Manejo de errores

- **Utils** (`src/utils/`): Utilidades
  - `formatters.ts`: Formateo de datos
  - `validators.ts`: Validaciones del cliente
  - `constants.ts`: Constantes de la aplicación

### Routing y Navegación

```
┌─────────────────┐
│   App Router    │
├─────────────────┤
│ Public Routes:  │
│ /               │
│ /login          │
│ /register       │
│ /recipes        │
│ /recipe/:id     │
├─────────────────┤
│ Private Routes: │
│ /dashboard      │
│ /profile        │
│ /my-recipes     │
│ /create-recipe  │
└─────────────────┘
```

## Base de Datos

### Modelo de Datos

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Recipe    │    │  Category   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │◄──┤ userId (FK) │    │ id (PK)     │
│ email       │    │ title       │    │ name        │
│ name        │    │ description │    │ description │
│ password    │    │ image       │    │ color       │
│ role        │    │ prepTime    │    └─────────────┘
│ avatar      │    │ cookTime    │           │
│ bio         │    │ servings    │           │
│ createdAt   │    │ difficulty  │           │
│ updatedAt   │    │ isPublished │           │
└─────────────┘    │ createdAt   │           │
                   │ updatedAt   │           │
                   └─────────────┘           │
                          │                  │
                          │                  │
                   ┌─────────────┐    ┌─────────────┐
                   │ RecipeStep  │    │RecipeCategory│
                   ├─────────────┤    ├─────────────┤
                   │ id (PK)     │    │ recipeId(FK)│
                   │ recipeId(FK)│    │categoryId(FK)│
                   │ stepNumber  │    └─────────────┘
                   │ instruction │
                   │ duration    │
                   └─────────────┘
```

### Relaciones Principales

1. **User → Recipe**: Un usuario puede tener múltiples recetas (1:N)
2. **Recipe → RecipeStep**: Una receta tiene múltiples pasos (1:N)
3. **Recipe ↔ Category**: Relación muchos a muchos a través de RecipeCategory
4. **Recipe ↔ Ingredient**: Relación muchos a muchos a través de RecipeIngredient
5. **User ↔ Recipe**: Likes a través de RecipeLike (M:N)
6. **User → Comment**: Un usuario puede comentar múltiples recetas (1:N)

### Índices y Optimización

```sql
-- Índices principales para optimización
CREATE INDEX idx_recipe_user_id ON "Recipe"("userId");
CREATE INDEX idx_recipe_published ON "Recipe"("isPublished");
CREATE INDEX idx_recipe_created_at ON "Recipe"("createdAt");
CREATE INDEX idx_comment_recipe_id ON "Comment"("recipeId");
CREATE INDEX idx_recipe_like_user_recipe ON "RecipeLike"("userId", "recipeId");
```

## Flujo de Datos

### Flujo de Autenticación

```
┌─────────────┐    1. Login     ┌─────────────┐
│  Frontend   │ ──────────────► │   Backend   │
│             │                 │             │
│             │ ◄────────────── │             │
│             │   2. JWT Token  │             │
└─────────────┘                 └─────────────┘
       │                               │
       │ 3. Store Token                │ 4. Verify Token
       ▼                               ▼
┌─────────────┐                 ┌─────────────┐
│ LocalStorage│                 │ JWT Service │
└─────────────┘                 └─────────────┘
```

### Flujo de Operaciones CRUD

```
┌─────────────┐  1. User Action  ┌─────────────┐
│ React Page  │ ──────────────► │ API Service │
└─────────────┘                 └─────────────┘
       ▲                               │
       │                               │ 2. HTTP Request
       │ 6. Update UI                  ▼
┌─────────────┐                 ┌─────────────┐
│   Context   │ ◄────────────── │   Backend   │
│   State     │  5. Response    │ Controller  │
└─────────────┘                 └─────────────┘
                                       │
                                       │ 3. Business Logic
                                       ▼
                                ┌─────────────┐
                                │   Service   │
                                │   Layer     │
                                └─────────────┘
                                       │
                                       │ 4. Database Query
                                       ▼
                                ┌─────────────┐
                                │ Prisma ORM  │
                                │ PostgreSQL  │
                                └─────────────┘
```

## Seguridad

### Medidas de Seguridad Implementadas

#### Backend
1. **Autenticación JWT**: Tokens seguros con expiración
2. **Autorización**: Middleware de verificación de permisos
3. **Validación de Entrada**: Sanitización de todos los inputs
4. **Rate Limiting**: Limitación de peticiones por IP
5. **CORS**: Configuración restrictiva de orígenes
6. **Helmet**: Headers de seguridad HTTP
7. **Password Hashing**: bcrypt para contraseñas
8. **SQL Injection Prevention**: Prisma ORM con queries parametrizadas

#### Frontend
1. **XSS Prevention**: Sanitización de contenido dinámico
2. **CSRF Protection**: Tokens CSRF en formularios
3. **Secure Storage**: Tokens en httpOnly cookies (recomendado)
4. **Input Validation**: Validación del lado cliente
5. **HTTPS Only**: Forzar conexiones seguras

### Flujo de Seguridad

```
┌─────────────┐    Request      ┌─────────────┐
│  Frontend   │ ──────────────► │ Rate Limiter│
└─────────────┘                 └─────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │ CORS Check  │
                                └─────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │ JWT Verify  │
                                └─────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │ Input Valid │
                                └─────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │ Controller  │
                                └─────────────┘
```

## Escalabilidad

### Estrategias de Escalabilidad

#### Horizontal Scaling
1. **Load Balancer**: Distribución de carga entre instancias
2. **Stateless Design**: Backend sin estado para fácil replicación
3. **Database Sharding**: Particionamiento de datos por usuario/región
4. **CDN**: Distribución de contenido estático

#### Vertical Scaling
1. **Database Optimization**: Índices y queries optimizadas
2. **Caching**: Redis para datos frecuentemente accedidos
3. **Connection Pooling**: Pool de conexiones a BD
4. **Compression**: Compresión de respuestas HTTP

### Arquitectura Escalable

```
                    ┌─────────────┐
                    │Load Balancer│
                    └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Backend     │    │ Backend     │    │ Backend     │
│ Instance 1  │    │ Instance 2  │    │ Instance 3  │
└─────────────┘    └─────────────┘    └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │ Cluster     │
                    └─────────────┘
```

## Patrones de Diseño

### Backend Patterns

1. **MVC (Model-View-Controller)**: Separación de responsabilidades
2. **Repository Pattern**: Abstracción de acceso a datos
3. **Service Layer Pattern**: Lógica de negocio centralizada
4. **Middleware Pattern**: Funcionalidades transversales
5. **Factory Pattern**: Creación de objetos complejos
6. **Observer Pattern**: Eventos y notificaciones

### Frontend Patterns

1. **Component Pattern**: Componentes reutilizables
2. **Container/Presentational**: Separación de lógica y presentación
3. **Higher-Order Components**: Funcionalidad compartida
4. **Custom Hooks**: Lógica reutilizable
5. **Provider Pattern**: Gestión de estado global
6. **Compound Components**: Componentes compuestos

### Ejemplo de Implementación - Repository Pattern

```typescript
// Backend - Repository Pattern
interface RecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findByUser(userId: string): Promise<Recipe[]>;
  create(data: CreateRecipeData): Promise<Recipe>;
  update(id: string, data: UpdateRecipeData): Promise<Recipe>;
  delete(id: string): Promise<void>;
}

class PrismaRecipeRepository implements RecipeRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({ where: { id } });
  }
  
  // ... otras implementaciones
}
```

### Ejemplo de Implementación - Custom Hook

```typescript
// Frontend - Custom Hook Pattern
function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { recipes, loading, error, fetchRecipes };
}
```

## Conclusión

La arquitectura de RecipeHub está diseñada para ser:

- **Mantenible**: Código organizado y bien estructurado
- **Escalable**: Preparada para crecimiento
- **Segura**: Múltiples capas de seguridad
- **Testeable**: Arquitectura que facilita testing
- **Performante**: Optimizada para rendimiento

Esta documentación proporciona una base sólida para el desarrollo, mantenimiento y evolución del sistema RecipeHub.