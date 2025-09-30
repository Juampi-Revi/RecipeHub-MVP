import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function LoadingSpinner({ 
  size = 'md', 
  message, 
  className = '', 
  fullScreen = false 
}: LoadingSpinnerProps) {

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]} ${className}`} />
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {spinner}
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export function LoadingPage({ message }: { message?: string }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner 
        size="xl" 
        message={message || t('common.loading')} 
      />
    </div>
  );
}

export function LoadingCard({ message, className = '' }: { message?: string; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 ${className}`}>
      <LoadingSpinner 
        size="lg" 
        message={message} 
      />
    </div>
  );
}