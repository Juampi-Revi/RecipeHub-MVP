import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
            {t('auth.signIn.title')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors">
            {t('auth.signIn.subtitle')}
          </p>
        </div>
        
        <div className="card">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {t('auth.signIn.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input mt-1"
                placeholder={t('auth.signIn.email')}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {t('auth.signIn.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input mt-1"
                placeholder={t('auth.signIn.password')}
              />
            </div>
            
            <button type="submit" className="btn-primary w-full">
              {t('auth.signIn.signInButton')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
              {t('auth.signIn.noAccount')}{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                {t('auth.signIn.signUpLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}