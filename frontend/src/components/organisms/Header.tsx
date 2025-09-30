import { Link } from 'react-router-dom';
import { ChefHat, User, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../atoms/LanguageSelector';
import ThemeToggle from '../atoms/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
              RecipeHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <Link
              to="/recipes"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              {t('navigation.recipes')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSelector />
            
            {isAuthenticated && (
              <Link
                to="/recipes/create"
                className="hidden sm:flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t('navigation.addRecipe')}</span>
              </Link>
            )}
            
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{t('navigation.signIn')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}