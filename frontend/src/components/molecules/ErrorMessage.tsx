import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'page';
  className?: string;
}

export function ErrorMessage({
  title,
  message,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = ''
}: ErrorMessageProps) {
  const { t } = useTranslation();

  const content = (
    <>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
            >
              <span className="sr-only">{t('common.dismiss')}</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      )}
    </>
  );

  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 ${className}`}>
      {content}
    </div>
  );
}

export function NetworkErrorMessage({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation();
  
  return (
    <ErrorMessage
      title={t('error.network.title')}
      message={t('error.network.message')}
      onRetry={onRetry}
      variant="card"
    />
  );
}

export function NotFoundMessage({ message }: { message?: string }) {
  const { t } = useTranslation();
  
  return (
    <ErrorMessage
      title={t('error.notFound.title')}
      message={message || t('error.notFound.message')}
      variant="page"
    />
  );
}