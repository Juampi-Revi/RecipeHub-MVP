# RecipeHub - Documentación de Rutas Frontend

## Índice
1. [Resumen de Rutas](#resumen-de-rutas)
2. [Rutas Públicas](#rutas-públicas)
3. [Rutas Privadas](#rutas-privadas)
4. [Protección de Rutas](#protección-de-rutas)
5. [Navegación y UX](#navegación-y-ux)
6. [Manejo de Estados](#manejo-de-estados)
7. [Implementación Técnica](#implementación-técnica)

## Resumen de Rutas

### Estructura de Navegación
```
RecipeHub Frontend Routes
├── Públicas (No requieren autenticación)
│   ├── / (Home)
│   ├── /recipes (Browse Recipes)
│   ├── /recipes/:id (Recipe Detail)
│   ├── /categories (Browse Categories)
│   ├── /login (Authentication)
│   ├── /register (User Registration)
│   └── /about (About Page)
├── Privadas (Requieren autenticación)
│   ├── /dashboard (User Dashboard)
│   ├── /profile (User Profile)
│   ├── /recipes/create (Create Recipe)
│   ├── /recipes/:id/edit (Edit Recipe)
│   ├── /my-recipes (User's Recipes)
│   ├── /favorites (Favorite Recipes)
│   └── /settings (User Settings)
└── Especiales
    ├── /404 (Not Found)
    ├── /unauthorized (Access Denied)
    └── /loading (Loading State)
```

## Rutas Públicas

### 1. Home Page (`/`)
- **Descripción**: Página principal de la aplicación
- **Componente**: `HomePage`
- **Funcionalidades**:
  - Hero section con call-to-action
  - Recetas destacadas
  - Categorías populares
  - Testimonios de usuarios
  - Footer con información de contacto

```typescript
// Ejemplo de implementación
const HomePage: React.FC = () => {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Cargar datos públicos
    loadFeaturedRecipes();
    loadPopularCategories();
  }, []);

  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedRecipes recipes={featuredRecipes} />
      <PopularCategories categories={popularCategories} />
      <Testimonials />
      <Footer />
    </div>
  );
};
```

### 2. Browse Recipes (`/recipes`)
- **Descripción**: Explorar todas las recetas públicas
- **Componente**: `RecipesPage`
- **Funcionalidades**:
  - Lista paginada de recetas
  - Filtros por categoría, dificultad, tiempo
  - Búsqueda por texto
  - Ordenamiento (más recientes, más populares, mejor valoradas)
  - Vista de grid/lista

```typescript
interface RecipesPageProps {
  searchParams?: {
    category?: string;
    difficulty?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

const RecipesPage: React.FC<RecipesPageProps> = ({ searchParams }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams?.category || '',
    difficulty: searchParams?.difficulty || '',
    search: searchParams?.search || '',
    sort: searchParams?.sort || 'newest',
  });

  // Implementación de filtros y búsqueda
};
```

### 3. Recipe Detail (`/recipes/:id`)
- **Descripción**: Vista detallada de una receta específica
- **Componente**: `RecipeDetailPage`
- **Funcionalidades**:
  - Información completa de la receta
  - Ingredientes y pasos
  - Comentarios y valoraciones (solo lectura para usuarios no autenticados)
  - Botón para guardar en favoritos (requiere login)
  - Compartir en redes sociales

```typescript
interface RecipeDetailPageProps {
  recipeId: string;
}

const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({ recipeId }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadRecipe(recipeId);
    loadComments(recipeId);
  }, [recipeId]);

  return (
    <div className="recipe-detail">
      <RecipeHeader recipe={recipe} />
      <RecipeIngredients ingredients={recipe?.ingredients} />
      <RecipeSteps steps={recipe?.steps} />
      <RecipeComments 
        comments={comments} 
        canComment={!!user}
        recipeId={recipeId}
      />
    </div>
  );
};
```

### 4. Browse Categories (`/categories`)
- **Descripción**: Explorar recetas por categorías
- **Componente**: `CategoriesPage`
- **Funcionalidades**:
  - Grid de categorías con imágenes
  - Contador de recetas por categoría
  - Navegación a recetas de cada categoría

### 5. Login (`/login`)
- **Descripción**: Página de inicio de sesión
- **Componente**: `LoginPage`
- **Funcionalidades**:
  - Formulario de login (email/password)
  - Validación en tiempo real
  - Recordar sesión
  - Link a registro
  - Recuperación de contraseña

```typescript
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <div className="login-page">
      <LoginForm onSubmit={handleSubmit} />
      <div className="login-links">
        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  );
};
```

### 6. Register (`/register`)
- **Descripción**: Página de registro de usuarios
- **Componente**: `RegisterPage`
- **Funcionalidades**:
  - Formulario de registro
  - Validación de datos
  - Términos y condiciones
  - Confirmación por email

### 7. About (`/about`)
- **Descripción**: Información sobre la aplicación
- **Componente**: `AboutPage`
- **Funcionalidades**:
  - Historia del proyecto
  - Equipo de desarrollo
  - Misión y visión
  - Contacto

## Rutas Privadas

### 1. Dashboard (`/dashboard`)
- **Descripción**: Panel principal del usuario autenticado
- **Componente**: `DashboardPage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Resumen de actividad del usuario
  - Recetas recientes del usuario
  - Estadísticas personales
  - Accesos rápidos a funciones principales

```typescript
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (user) {
      loadUserStats(user.id);
      loadRecentRecipes(user.id);
    }
  }, [user]);

  return (
    <div className="dashboard">
      <DashboardHeader user={user} />
      <StatsCards stats={userStats} />
      <RecentActivity recipes={recentRecipes} />
      <QuickActions />
    </div>
  );
};
```

### 2. User Profile (`/profile`)
- **Descripción**: Perfil del usuario
- **Componente**: `ProfilePage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Información personal del usuario
  - Avatar y biografía
  - Estadísticas públicas
  - Recetas públicas del usuario

### 3. Create Recipe (`/recipes/create`)
- **Descripción**: Crear nueva receta
- **Componente**: `CreateRecipePage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Formulario completo de receta
  - Upload de imágenes
  - Editor de pasos con drag & drop
  - Gestión de ingredientes
  - Preview antes de publicar

```typescript
const CreateRecipePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<CreateRecipeData>({
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    categories: [],
    difficulty: 'medium',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
  });

  const handleSubmit = async (data: CreateRecipeData) => {
    try {
      const newRecipe = await createRecipe(data);
      navigate(`/recipes/${newRecipe.id}`);
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <div className="create-recipe-page">
      <RecipeForm 
        recipe={recipe}
        onSubmit={handleSubmit}
        mode="create"
      />
    </div>
  );
};
```

### 4. Edit Recipe (`/recipes/:id/edit`)
- **Descripción**: Editar receta existente
- **Componente**: `EditRecipePage`
- **Autenticación**: Requerida + Ownership
- **Funcionalidades**:
  - Formulario pre-poblado con datos existentes
  - Validación de propiedad de la receta
  - Historial de cambios
  - Preview de cambios

```typescript
const EditRecipePage: React.FC<{ recipeId: string }> = ({ recipeId }) => {
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await getRecipe(recipeId);
        setRecipe(recipeData);
        setCanEdit(recipeData.userId === user?.id);
      } catch (error) {
        // Manejo de errores
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId, user]);

  if (!canEdit) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="edit-recipe-page">
      <RecipeForm 
        recipe={recipe}
        onSubmit={handleUpdate}
        mode="edit"
      />
    </div>
  );
};
```

### 5. My Recipes (`/my-recipes`)
- **Descripción**: Gestión de recetas del usuario
- **Componente**: `MyRecipesPage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Lista de todas las recetas del usuario
  - Filtros por estado (publicada, borrador)
  - Acciones rápidas (editar, eliminar, publicar)
  - Estadísticas de cada receta

### 6. Favorites (`/favorites`)
- **Descripción**: Recetas favoritas del usuario
- **Componente**: `FavoritesPage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Lista de recetas marcadas como favoritas
  - Organización por categorías
  - Búsqueda dentro de favoritos
  - Exportar lista de favoritos

### 7. Settings (`/settings`)
- **Descripción**: Configuración de la cuenta
- **Componente**: `SettingsPage`
- **Autenticación**: Requerida
- **Funcionalidades**:
  - Configuración de perfil
  - Cambio de contraseña
  - Preferencias de notificaciones
  - Configuración de privacidad
  - Eliminar cuenta

## Protección de Rutas

### Implementación de Route Guards

```typescript
// ProtectedRoute Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOwnership?: boolean;
  resourceId?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireOwnership = false,
  resourceId,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (requireAuth && !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  if (requireOwnership && resourceId) {
    // Verificar ownership del recurso
    const hasOwnership = checkResourceOwnership(user?.id, resourceId);
    if (!hasOwnership) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
```

### Router Configuration

```typescript
// App Router Setup
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Rutas Privadas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/create"
          element={
            <ProtectedRoute>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id/edit"
          element={
            <ProtectedRoute requireOwnership>
              <EditRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-recipes"
          element={
            <ProtectedRoute>
              <MyRecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas Especiales */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

## Navegación y UX

### Navigation Component

```typescript
const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const publicLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/recipes', label: 'Recetas' },
    { path: '/categories', label: 'Categorías' },
    { path: '/about', label: 'Acerca de' },
  ];

  const privateLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/my-recipes', label: 'Mis Recetas' },
    { path: '/favorites', label: 'Favoritos' },
    { path: '/recipes/create', label: 'Crear Receta' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">RecipeHub</Link>
      </div>
      
      <div className="nav-links">
        {publicLinks.map(link => (
          <NavLink 
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
        
        {user && privateLinks.map(link => (
          <NavLink 
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-auth">
        {user ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-outline">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
```

### Breadcrumb Navigation

```typescript
const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap: Record<string, string> = {
    '/recipes': 'Recetas',
    '/categories': 'Categorías',
    '/dashboard': 'Dashboard',
    '/profile': 'Perfil',
    '/my-recipes': 'Mis Recetas',
    '/favorites': 'Favoritos',
    '/settings': 'Configuración',
    '/recipes/create': 'Crear Receta',
  };

  return (
    <nav className="breadcrumb">
      <Link to="/">Inicio</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[to] || value;

        return isLast ? (
          <span key={to} className="breadcrumb-current">
            {name}
          </span>
        ) : (
          <Link key={to} to={to} className="breadcrumb-link">
            {name}
          </Link>
        );
      })}
    </nav>
  );
};
```

## Manejo de Estados

### Authentication Context

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token)
        .then(userData => setUser(userData))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Route-specific State Management

```typescript
// Custom hook para manejo de estado de recetas
const useRecipes = (filters?: RecipeFilters) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const loadRecipes = useCallback(async (newFilters?: RecipeFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await recipeAPI.getRecipes({
        ...filters,
        ...newFilters,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      setRecipes(response.recipes);
      setPagination(response.pagination);
    } catch (err) {
      setError('Error al cargar las recetas');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes,
    loading,
    error,
    pagination,
    loadRecipes,
    setPage: (page: number) => setPagination(prev => ({ ...prev, page })),
  };
};
```

## Implementación Técnica

### Route Lazy Loading

```typescript
// Lazy loading de componentes para mejor performance
const HomePage = lazy(() => import('../pages/HomePage'));
const RecipesPage = lazy(() => import('../pages/RecipesPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Wrapper con Suspense
const LazyRoute: React.FC<{ component: React.ComponentType }> = ({ 
  component: Component 
}) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);
```

### Error Boundaries

```typescript
class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error:', error, errorInfo);
    // Enviar error a servicio de logging
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### SEO y Meta Tags

```typescript
// Hook para manejo de meta tags
const usePageMeta = (meta: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}) => {
  useEffect(() => {
    document.title = `${meta.title} | RecipeHub`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && meta.keywords) {
      metaKeywords.setAttribute('content', meta.keywords);
    }

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', meta.description);
    }

    if (meta.image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', meta.image);
      }
    }
  }, [meta]);
};
```

## Conclusión

La estructura de rutas de RecipeHub está diseñada para:

1. **Seguridad**: Protección adecuada de rutas privadas
2. **UX**: Navegación intuitiva y consistente
3. **Performance**: Lazy loading y optimizaciones
4. **Maintainability**: Código organizado y reutilizable
5. **SEO**: Meta tags y estructura semántica

Esta implementación proporciona una base sólida para la navegación y el control de acceso en la aplicación RecipeHub.