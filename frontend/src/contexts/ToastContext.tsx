import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '../components/molecules/Toast';
import type { ToastProps } from '../components/molecules/Toast';

export interface ToastContextType {
  success: (message: string, options?: { title?: string; duration?: number }) => string;
  error: (message: string, options?: { title?: string; duration?: number }) => string;
  warning: (message: string, options?: { title?: string; duration?: number }) => string;
  info: (message: string, options?: { title?: string; duration?: number }) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((type: ToastProps['type'], message: string, options?: { title?: string; duration?: number }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastProps = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      },
    };

    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    return addToast('success', message, options);
  }, [addToast]);

  const error = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    return addToast('error', message, { duration: 7000, ...options });
  }, [addToast]);

  const warning = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    return addToast('warning', message, options);
  }, [addToast]);

  const info = useCallback((message: string, options?: { title?: string; duration?: number }) => {
    return addToast('info', message, options);
  }, [addToast]);

  const contextValue: ToastContextType = {
    success,
    error,
    warning,
    info,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}