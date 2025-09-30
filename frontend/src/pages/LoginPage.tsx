import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getAuthErrorInfo } from '../utils/errorHandling';
import type { LoginRequest } from '../types';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      success(t('auth.signIn.success') || 'Login successful!');
      navigate('/');
    },
    onError: (err: Error) => {
      const errorInfo = getAuthErrorInfo(err);
      const translatedMessage = t(errorInfo.translationKey) || errorInfo.message;
      error(translatedMessage);
    }
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      loginMutation.mutate(formData);
    }
  };
  
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {t('auth.signIn.email') || 'Email'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`input mt-1 ${errors.email ? 'border-red-500' : ''}`}
                placeholder={t('auth.signIn.email') || 'Email'}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {t('auth.signIn.password') || 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`input mt-1 ${errors.password ? 'border-red-500' : ''}`}
                placeholder={t('auth.signIn.password') || 'Password'}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending 
                ? (t('common.loading') || 'Signing in...') 
                : (t('auth.signIn.signInButton') || 'Sign In')
              }
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