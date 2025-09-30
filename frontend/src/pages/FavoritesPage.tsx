import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

const mockFavoriteRecipes = [
  {
    id: 3,
    title: 'Tacos al Pastor',
    description: 'Deliciosos tacos mexicanos con carne al pastor',
    image: '/src/assets/recipe-placeholder.svg',
    cookingTime: 45,
    difficulty: 'medium',
    author: 'Chef María',
    favoriteDate: '2024-01-20'
  },
  {
    id: 4,
    title: 'Sushi Rolls',
    description: 'Rolls de sushi frescos con salmón y aguacate',
    image: '/src/assets/recipe-placeholder.svg',
    cookingTime: 60,
    difficulty: 'hard',
    author: 'Chef Tanaka',
    favoriteDate: '2024-01-18'
  }
];

export function FavoritesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      return mockFavoriteRecipes;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          {t('profile.favorites.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('profile.favorites.subtitle')}
        </p>
      </div>

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('profile.favorites.noFavorites')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('profile.favorites.noFavoritesDescription')}
          </p>
          <a
            href="/recipes"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block"
          >
            {t('profile.favorites.exploreRecipes')}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((recipe) => (
            <div key={recipe.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recipe.cookingTime} min
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                          {t(`recipes.difficulty.${recipe.difficulty}`)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {recipe.author}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        {t('profile.favorites.addedOn')} {new Date(recipe.favoriteDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        title={t('profile.favorites.removeFromFavorites')}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <a
                        href={`/recipes/${recipe.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title={t('profile.favorites.viewRecipe')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}