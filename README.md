# RecipeHub - Aplicación de Recetas

Una aplicación web moderna para gestionar y compartir recetas, construida con React, TypeScript, Node.js y Prisma.

## 🚀 Características Principales

- **Frontend Moderno**: React 18 con TypeScript, Tailwind CSS y React Query
- **Backend Robusto**: Node.js con Express, Prisma ORM y SQLite
- **Autenticación**: Sistema completo de registro y login con JWT
- **Gestión de Recetas**: CRUD completo con filtros, búsqueda y paginación
- **Responsive Design**: Interfaz adaptable a todos los dispositivos
- **Internacionalización**: Soporte para múltiples idiomas
- **Tema Oscuro**: Modo claro/oscuro con persistencia
- **Optimización de Performance**: Lazy loading, memoización y code splitting

## 📁 Estructura del Proyecto

```
challenge_orderTob/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── atoms/       # Componentes básicos
│   │   │   ├── molecules/   # Componentes compuestos
│   │   │   └── organisms/   # Componentes complejos
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── contexts/       # Contextos de React
│   │   ├── services/       # Servicios API
│   │   ├── types/          # Definiciones TypeScript
│   │   └── utils/          # Utilidades
│   └── package.json
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores de rutas
│   │   ├── services/       # Lógica de negocio
│   │   ├── middleware/     # Middlewares
│   │   ├── utils/          # Utilidades
│   │   └── types/          # Tipos TypeScript
│   ├── prisma/             # Esquema y migraciones
│   └── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **React Query** - Gestión de estado del servidor
- **React Router** - Enrutamiento
- **React Hook Form** - Gestión de formularios
- **i18next** - Internacionalización
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Prisma** - ORM y gestión de base de datos
- **SQLite** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hashing de contraseñas
- **Winston** - Logging
- **Helmet** - Seguridad

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd challenge_orderTob
```

### 2. Configurar el Backend
```bash
cd backend
npm install

# Crear archivo de configuración
cp .env.example .env

# Ejecutar migraciones
npx prisma migrate dev

# Poblar la base de datos
npx prisma db seed

# Iniciar el servidor
npm run dev
```

### 3. Configurar el Frontend
```bash
cd frontend
npm install

# Iniciar la aplicación
npm run dev
```

### 4. Acceder a la aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health

## 🔧 Variables de Entorno

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Perfil del usuario

### Recetas
- `GET /api/recipes` - Listar recetas (con filtros y paginación)
- `GET /api/recipes/:id` - Obtener receta específica
- `POST /api/recipes` - Crear nueva receta
- `PUT /api/recipes/:id` - Actualizar receta
- `DELETE /api/recipes/:id` - Eliminar receta

### Categorías
- `GET /api/categories` - Listar categorías

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil

## 🎨 Características de UI/UX

### Componentes Optimizados
- **Lazy Loading**: Carga diferida de páginas
- **React.memo**: Optimización de re-renders
- **useMemo/useCallback**: Memoización de cálculos costosos
- **Error Boundaries**: Manejo robusto de errores

### Sistema de Notificaciones
- Toast notifications para feedback del usuario
- Manejo centralizado de errores
- Estados de carga consistentes

### Responsive Design
- Mobile-first approach
- Breakpoints optimizados
- Componentes adaptativos

## 🔒 Seguridad

- Autenticación JWT
- Validación de datos en frontend y backend
- Rate limiting
- Sanitización de inputs
- Headers de seguridad con Helmet
- Hashing seguro de contraseñas

## 🧪 Testing y Desarrollo

### Scripts Disponibles

#### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting
```

#### Backend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar TypeScript
npm run start        # Servidor de producción
npm run prisma:studio # Interfaz de base de datos
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build del proyecto: `npm run build`
2. Deploy de la carpeta `dist/`

### Backend (Railway/Heroku)
1. Configurar variables de entorno
2. Ejecutar migraciones: `npx prisma migrate deploy`
3. Deploy del código

## 📈 Performance

### Optimizaciones Implementadas
- **Code Splitting**: Lazy loading de rutas
- **Memoización**: React.memo, useMemo, useCallback
- **Caching**: React Query con stale-while-revalidate
- **Bundle Optimization**: Tree shaking y minificación
- **Image Optimization**: Lazy loading de imágenes

### Métricas
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [TuGitHub](https://github.com/tuusuario)

## 🙏 Agradecimientos

- React Team por la excelente documentación
- Prisma por el ORM intuitivo
- Tailwind CSS por el framework de estilos
- Toda la comunidad open source