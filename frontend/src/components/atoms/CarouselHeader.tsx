import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface CarouselHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  children?: ReactNode;
  isLoading?: boolean;
}

export function CarouselHeader({ title, subtitle, viewAllLink, children, isLoading = false }: CarouselHeaderProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
          {subtitle && (
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
          >
            Ver todas
          </Link>
        )}
        
        {children}
      </div>
    </div>
  );
}