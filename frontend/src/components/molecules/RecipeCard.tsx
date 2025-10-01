import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToggleLike } from '../../hooks/useRecipes';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  className?: string;
}

export const RecipeCard = memo(function RecipeCard({ recipe, onClick, className = '' }: RecipeCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toggleLikeMutation = useToggleLike();

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }

    toggleLikeMutation.mutate(recipe.id);
  };

  // Only show favorite button if user is logged in and it's not their own recipe
  const showFavoriteButton = user && user.id !== recipe.authorId;

  const cardContent = (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Recipe Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Favorite Button */}
        {showFavoriteButton && (
          <button
            onClick={handleToggleLike}
            disabled={toggleLikeMutation.isPending}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title={recipe.isLikedByUser ? t('recipes.removeFavorite') : t('recipes.addFavorite')}
          >
            <Heart 
              className={`w-5 h-5 ${
                recipe.isLikedByUser 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            />
          </button>
        )}
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Recipe Meta */}
        <div className="flex items-center justify-between mb-3">
          {/* Difficulty Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty.toLowerCase() as keyof typeof difficultyColors]}`}>
            {t(`recipes.difficulty.${recipe.difficulty}`)}
          </span>

          {/* Prep Time */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(recipe.prepTime)}
          </div>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {t('recipes.by')} {recipe.author?.name || t('recipes.anonymous')}
          </span>
          <span>
            {new Date(recipe.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Rating (if available) */}
        {recipe.averageRating && (
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(recipe.averageRating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
              ({recipe.averageRating?.toFixed(1)})
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // If no onClick handler, wrap in Link
  if (!onClick) {
    return (
      <Link to={`/recipes/${recipe.id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
});