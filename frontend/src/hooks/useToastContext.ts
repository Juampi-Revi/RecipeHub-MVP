import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import type { ToastContextType } from '../contexts/ToastContext';

export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}