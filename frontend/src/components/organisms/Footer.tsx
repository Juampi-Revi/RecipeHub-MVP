import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="text-lg font-bold">RecipeHub</div>
          <div className="text-gray-400 text-sm">
            © 2024 RecipeHub. {t('footer.allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
}