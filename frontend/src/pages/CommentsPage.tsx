import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

const mockUserComments = [
  {
    id: 1,
    comment: 'Excellent recipe! I made it for my family and they loved it. Very easy to follow.',
    rating: 5,
    createdAt: '2024-01-22',
    recipe: {
      id: 5,
      title: 'Pizza Margherita',
      image: '/src/assets/recipe-placeholder.svg'
    }
  },
  {
    id: 2,
    comment: 'Good recipe, although I think it needs a bit more salt. Overall it\'s fine.',
    rating: 4,
    createdAt: '2024-01-20',
    recipe: {
      id: 6,
      title: 'Greek Salad',
      image: '/src/assets/recipe-placeholder.svg'
    }
  },
  {
    id: 3,
    comment: 'I didn\'t like it much, I think the instructions are not very clear.',
    rating: 2,
    createdAt: '2024-01-18',
    recipe: {
      id: 7,
      title: 'Pasta Alfredo',
      image: '/src/assets/recipe-placeholder.svg'
    }
  }
];

export function CommentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['user-comments', user?.id],
    queryFn: async () => {
      return mockUserComments;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          {t('profile.comments.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('profile.comments.subtitle')}
        </p>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('profile.comments.noComments')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('profile.comments.noCommentsDescription')}
          </p>
          <a
            href="/recipes"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block"
          >
            {t('profile.comments.exploreRecipes')}
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={comment.recipe.image}
                  alt={comment.recipe.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {comment.recipe.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          {renderStars(comment.rating)}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(comment.rating)}`}>
                          {comment.rating}/5
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          • {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        title={t('profile.comments.editComment')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title={t('profile.comments.deleteComment')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={`/recipes/${comment.recipe.id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                    >
                      {t('profile.comments.viewRecipe')} →
                    </a>
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