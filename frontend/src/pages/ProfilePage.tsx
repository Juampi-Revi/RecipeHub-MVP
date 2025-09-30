import { useTranslation } from 'react-i18next';

export function ProfilePage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.profile.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('pages.profile.subtitle')}
        </p>
      </div>
    </div>
  );
}