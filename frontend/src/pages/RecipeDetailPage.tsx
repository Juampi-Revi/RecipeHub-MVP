import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Users, ChefHat, Star, Heart } from 'lucide-react';
import { useRecipe, useToggleLike } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../components/molecules/ErrorMessage';
import { IngredientList } from '../components/molecules/IngredientList';
import RecipeSteps from '../components/molecules/RecipeSteps';
import { CommentList } from '../components/molecules/CommentList';
import { useParams, useNavigate } from 'react-router-dom';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data: recipe, isLoading, error } = useRecipe(id!);
  const toggleLikeMutation = useToggleLike();

  const handleToggleLike = async () => {
    if (!user || !recipe) return;
    try {
      await toggleLikeMutation.mutateAsync(recipe.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  };

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </button>
        </div>
        <ErrorMessage 
          title={t('error.notFound.title')}
          message={t('error.notFound.message')}
          variant="card"
        />
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </button>
        </div>
        <ErrorMessage 
          title={t('error.loadingRecipe.title')}
          message={error.message || t('error.loadingRecipe.message')}
          onRetry={() => window.location.reload()}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        {t('common.back')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Recipe Image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-64 md:h-80 flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          {/* Recipe Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                {recipe.title}
              </h1>
              {user && (
                <button
                  onClick={handleToggleLike}
                  disabled={toggleLikeMutation.isPending}
                  className={`ml-4 p-3 rounded-full transition-all duration-200 ${
                    recipe.isLikedByUser
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                      : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-500 dark:bg-gray-700 dark:hover:bg-gray-600'
                  } ${toggleLikeMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={recipe.isLikedByUser ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <Heart 
                    className={`h-6 w-6 ${recipe.isLikedByUser ? 'fill-current' : ''}`} 
                  />
                </button>
              )}
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {recipe.description}
            </p>

            {/* Recipe Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-5 h-5 mr-2" />
                <span>{formatTime(recipe.prepTime)}</span>
              </div>
              
              {recipe.servings && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{recipe.servings} {t('recipes.servings')}</span>
                </div>
              )}
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recipe.complexity as keyof typeof difficultyColors]}`}>
                {t(`recipes.complexity.${recipe.complexity}`)}
              </span>

              {recipe.averageRating && (
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(recipe.averageRating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    ({recipe.averageRating.toFixed(1)})
                  </span>
                </div>
              )}
            </div>

            {/* Category and Author */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              {recipe.categories && recipe.categories.length > 0 && (
                <span>
                  {t('recipes.category')}: 
                  {recipe.categories.map((cat, index) => (
                    <span key={cat.id}>
                      <span className="font-medium">{t(`recipes.categories.${cat.category.name}`)}</span>
                      {index < recipe.categories.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              )}
              {recipe.author && (
                <span>
                  {t('recipes.author')}: <span className="font-medium">{recipe.author.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-8">
              <IngredientList ingredients={recipe.ingredients} />
            </div>
          )}

          {/* Recipe Steps */}
          {recipe.steps && recipe.steps.length > 0 ? (
            <div className="mb-8">
              <RecipeSteps steps={recipe.steps} />
            </div>
          ) : recipe.instructions && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('recipes.instructions')}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {(() => {
                  try {
                    const instructions = JSON.parse(recipe.instructions);
                    if (Array.isArray(instructions)) {
                      return (
                        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                          {instructions.map((instruction, index) => {
                            const translatedInstruction = t(`recipeInstructions.${instruction}`, { defaultValue: null });
                            const hasTranslation = translatedInstruction !== null && translatedInstruction !== `recipeInstructions.${instruction}`;
                            
                            return (
                              <li key={index} className="pl-2">
                                {hasTranslation ? translatedInstruction : instruction}
                              </li>
                            );
                          })}
                        </ol>
                      );
                    }
                  } catch {
                     // Fallback to original text if JSON parsing fails
                   }
                  return (
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                      {recipe.instructions}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {recipe.cookTime && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('recipes.additionalInfo')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('recipes.cookTime')}:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {formatTime(recipe.cookTime)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-8 mt-8">
            <CommentList 
              recipeId={recipe.id}
              recipeOwnerId={recipe.authorId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}