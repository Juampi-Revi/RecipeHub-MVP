# Documentación de Integración Frontend-Backend

## 🔗 Arquitectura de Integración

### Comunicación Cliente-Servidor

La aplicación utiliza una arquitectura REST API con las siguientes características:

- **Frontend**: React SPA que consume la API REST
- **Backend**: API REST con Express.js
- **Comunicación**: HTTP/HTTPS con JSON
- **Autenticación**: JWT Bearer tokens
- **Estado**: React Query para gestión de estado del servidor

## 📡 Configuración de API

### Base URL y Endpoints

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Interceptores de Request/Response

```typescript
// Request interceptor - Agregar token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación

1. **Login**: Usuario envía credenciales
2. **Validación**: Backend valida y genera JWT
3. **Almacenamiento**: Frontend guarda token en localStorage
4. **Autorización**: Token se envía en cada request

### Implementación Frontend

```typescript
// frontend/src/services/authService.ts
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    return { token, user };
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};
```

### Implementación Backend

```typescript
// backend/src/controllers/authController.ts
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await userService.validateCredentials(email, password);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
```

## 📊 Gestión de Estado con React Query

### Configuración Global

```typescript
// frontend/src/App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

### Queries para Datos

```typescript
// frontend/src/hooks/useRecipes.ts
export const useRecipes = (filters: RecipeFilters) => {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.getRecipes(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getRecipe(id),
    enabled: !!id,
  });
};
```

### Mutations para Acciones

```typescript
// frontend/src/hooks/useRecipeMutations.ts
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recipeService.createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
```

## 🛡️ Manejo de Errores

### Error Boundary Global

```typescript
// frontend/src/components/organisms/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Hook de Manejo de Errores

```typescript
// frontend/src/hooks/useErrorHandler.ts
export const useErrorHandler = () => {
  const { error: showErrorToast } = useToast();

  const handleError = useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      showErrorToast(message);
      return { message, status: error.response?.status };
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    showErrorToast(message);
    return { message };
  }, [showErrorToast]);

  return { handleError };
};
```

## 🔄 Sincronización de Datos

### Invalidación de Cache

```typescript
// Invalidar queries específicas
queryClient.invalidateQueries({ queryKey: ['recipes'] });

// Invalidar queries por patrón
queryClient.invalidateQueries({ queryKey: ['recipes'], exact: false });

// Refetch inmediato
queryClient.refetchQueries({ queryKey: ['recipes'] });
```

### Optimistic Updates

```typescript
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recipeService.updateRecipe,
    onMutate: async (updatedRecipe) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['recipe', updatedRecipe.id] });
      
      // Snapshot previous value
      const previousRecipe = queryClient.getQueryData(['recipe', updatedRecipe.id]);
      
      // Optimistically update
      queryClient.setQueryData(['recipe', updatedRecipe.id], updatedRecipe);
      
      return { previousRecipe };
    },
    onError: (err, updatedRecipe, context) => {
      // Rollback on error
      queryClient.setQueryData(['recipe', updatedRecipe.id], context?.previousRecipe);
    },
    onSettled: (data, error, updatedRecipe) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['recipe', updatedRecipe.id] });
    },
  });
};
```

## 🚀 Optimizaciones de Performance

### Lazy Loading de Páginas

```typescript
// frontend/src/App.tsx
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const RecipesPage = lazy(() => import('./pages/RecipesPage').then(module => ({ default: module.RecipesPage })));

// Uso con Suspense
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/recipes" element={<RecipesPage />} />
  </Routes>
</Suspense>
```

### Memoización de Componentes

```typescript
// Componentes memoizados
export const RecipeCard = memo(function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  // Component implementation
});

// Hooks optimizados
const handleFilterChange = useCallback((newFilters: Partial<RecipeFilters>) => {
  setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
}, []);

const paginationInfo = useMemo(() => {
  if (!recipesData?.pagination) return null;
  return {
    showPagination: recipesData.pagination.totalPages > 1,
    currentPage: recipesData.pagination.page,
    totalPages: recipesData.pagination.totalPages,
  };
}, [recipesData?.pagination]);
```

## 📱 Responsive Design

### Breakpoints Tailwind

```css
/* Mobile First Approach */
.container {
  @apply px-4;                    /* Default: mobile */
  @apply sm:px-6;                 /* Small: 640px+ */
  @apply lg:px-8;                 /* Large: 1024px+ */
  @apply xl:max-w-7xl xl:mx-auto; /* Extra Large: 1280px+ */
}
```

### Grid Responsivo

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</div>
```

## 🌐 Internacionalización

### Configuración i18next

```typescript
// frontend/src/i18n/index.ts
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });
```

### Uso en Componentes

```typescript
const { t } = useTranslation();

return (
  <h1>{t('pages.recipes.title')}</h1>
  <p>{t('recipes.count', { count: recipes.length })}</p>
);
```

## 🔧 Variables de Entorno

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=RecipeHub
VITE_APP_VERSION=1.0.0
```

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

## 🧪 Testing de Integración

### Tests de API

```typescript
// backend/tests/integration/recipes.test.ts
describe('Recipes API', () => {
  it('should get recipes with filters', async () => {
    const response = await request(app)
      .get('/api/recipes?category=desserts&difficulty=easy')
      .expect(200);
      
    expect(response.body.recipes).toBeDefined();
    expect(response.body.pagination).toBeDefined();
  });
});
```

### Tests de Frontend

```typescript
// frontend/src/tests/RecipesPage.test.tsx
describe('RecipesPage', () => {
  it('should load and display recipes', async () => {
    render(<RecipesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Recipes')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('recipe-grid')).toBeInTheDocument();
  });
});
```

## 📈 Monitoreo y Logging

### Frontend Logging

```typescript
// frontend/src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to monitoring service in production
  }
};
```

### Backend Logging

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
```

## 🚀 Deployment

### Frontend Build

```bash
# Build optimizado para producción
npm run build

# Preview del build
npm run preview
```

### Backend Build

```bash
# Compilar TypeScript
npm run build

# Ejecutar migraciones en producción
npx prisma migrate deploy

# Iniciar servidor
npm start
```

## 📊 Métricas de Performance

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### API Performance
- **Response Time**: < 200ms (promedio)
- **Throughput**: > 1000 req/min
- **Error Rate**: < 1%

## 🔍 Debugging

### Frontend DevTools

```typescript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* App components */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
```

### Backend Debug

```typescript
// Debug middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  next();
});
```

Esta documentación proporciona una guía completa para entender y mantener la integración entre el frontend y backend de la aplicación RecipeHub.