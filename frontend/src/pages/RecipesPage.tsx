import { useTranslation } from 'react-i18next';

export function RecipesPage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
          {t('pages.recipes.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('pages.recipes.subtitle')}
        </p>
      </div>
      
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Recipe listing will be implemented here
        </p>
      </div>
    </div>
  );
}