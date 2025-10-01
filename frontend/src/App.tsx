import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Header } from './components/organisms/Header';
import { Footer } from './components/organisms/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './components/providers/AuthProvider';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/organisms/ErrorBoundary';
import './i18n';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const RecipesPage = lazy(() => import('./pages/RecipesPage').then(module => ({ default: module.RecipesPage })));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage').then(module => ({ default: module.RecipeDetailPage })));
const CreateRecipePage = lazy(() => import('./pages/CreateRecipePage').then(module => ({ default: module.CreateRecipePage })));
const EditRecipePage = lazy(() => import('./pages/EditRecipePage').then(module => ({ default: module.EditRecipePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const MyRecipesPage = lazy(() => import('./pages/MyRecipesPage').then(module => ({ default: module.MyRecipesPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })));
const CommentsPage = lazy(() => import('./pages/CommentsPage').then(module => ({ default: module.CommentsPage })));
const ProfileLayout = lazy(() => import('./components/layout/ProfileLayout').then(module => ({ default: module.ProfileLayout })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
                  <Header />
                  <main className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                        <Route path="/recipes/create" element={<CreateRecipePage />} />
                        <Route path="/create-recipe" element={<CreateRecipePage />} />
                        <Route path="/recipe/:id/edit" element={<ProtectedRoute><EditRecipePage /></ProtectedRoute>} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
                          <Route index element={<ProfilePage />} />
                          <Route path="my-recipes" element={<MyRecipesPage />} />
                          <Route path="favorites" element={<FavoritesPage />} />
                          <Route path="comments" element={<CommentsPage />} />
                        </Route>
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </Router>
            </QueryClientProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
