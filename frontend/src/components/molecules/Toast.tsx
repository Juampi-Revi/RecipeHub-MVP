import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  action 
}: ToastProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const typeStyles = {
    success: {
      bg: 'bg-green-100 dark:bg-green-900/80',
      border: 'border-green-300 dark:border-green-700',
      icon: 'text-green-500',
      title: 'text-green-900 dark:text-green-100',
      message: 'text-green-800 dark:text-green-200',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900/80',
      border: 'border-red-300 dark:border-red-700',
      icon: 'text-red-500',
      title: 'text-red-900 dark:text-red-100',
      message: 'text-red-800 dark:text-red-200',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/80',
      border: 'border-yellow-300 dark:border-yellow-700',
      icon: 'text-yellow-500',
      title: 'text-yellow-900 dark:text-yellow-100',
      message: 'text-yellow-800 dark:text-yellow-200',
    },
    info: {
      bg: 'bg-blue-100 dark:bg-blue-900/80',
      border: 'border-blue-300 dark:border-blue-700',
      icon: 'text-blue-500',
      title: 'text-blue-900 dark:text-blue-100',
      message: 'text-blue-800 dark:text-blue-200',
    },
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`
        w-[384px] ${styles.bg} ${styles.border} border-2 rounded-xl shadow-2xl pointer-events-auto
        transform transition-all duration-300 ease-in-out backdrop-blur-sm
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
      `}
    >
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={styles.icon}>
              {icons[type]}
            </div>
          </div>
          <div className="ml-4 w-0 flex-1">
            {title && (
              <p className={`text-base font-semibold ${styles.title} mb-2`}>
                {title}
              </p>
            )}
            <p className={`text-base ${styles.message} leading-relaxed`}>
              {message}
            </p>
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium ${styles.title} hover:underline`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className={`inline-flex ${styles.icon} hover:opacity-75 transition-opacity`}
            >
              <span className="sr-only">{t('common.close')}</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}