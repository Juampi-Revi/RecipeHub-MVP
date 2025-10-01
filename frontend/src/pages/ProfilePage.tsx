import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

interface UserStatistics {
  totalRecipes: number;
  totalComments: number;
  totalLikes: number;
  totalFollowers: number;
  totalFollowing: number;
}

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalRecipes: 0,
    totalComments: 0,
    totalLikes: 0,
    totalFollowers: 0,
    totalFollowing: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const stats = await authService.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStatistics();
    }
  }, [user]);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          {t('profile.personalInfo.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('profile.personalInfo.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Read-only View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.personalInfo.name')}
            </label>
            <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {user?.name || '-'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.personalInfo.email')}
            </label>
            <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {user?.email || '-'}
            </div>
          </div>
        </div>

        {(user?.bio || user?.avatar) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('profile.personalInfo.bio')}
                </label>
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {user.bio}
                </div>
              </div>
            )}

            {user?.avatar && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('profile.personalInfo.avatar')}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white flex-1 text-sm">
                    {user.avatar}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Statistics */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('profile.personalInfo.statistics')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {loading ? '...' : statistics.totalRecipes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('profile.personalInfo.recipesCreated')}</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {loading ? '...' : statistics.totalLikes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('profile.personalInfo.favoriteRecipes')}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {loading ? '...' : statistics.totalComments}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('profile.personalInfo.commentsLeft')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}