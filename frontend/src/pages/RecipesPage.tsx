import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { recipeService } from '../services/recipeService';
import { RecipeFilters } from '../components/organisms/RecipeFilters';
import { RecipeCard } from '../components/molecules/RecipeCard';
import { LoadingCard } from '../components/atoms/LoadingSpinner';
import { ErrorMessage } from '../components/molecules/ErrorMessage';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useToast } from '../hooks/useToast';
import type { RecipeFilters as RecipeFiltersType, SortParams, PaginationParams } from '../types';

export function RecipesPage() {
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const { error: showErrorToast } = useToast();
  
  const [filters, setFilters] = useState<RecipeFiltersType & PaginationParams & SortParams>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch recipes
  const { 
    data: recipesData, 
    isLoading: recipesLoading, 
    error: recipesError,
    refetch: refetchRecipes
  } = useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.getRecipes(filters),
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => recipeService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Handle errors
  useEffect(() => {
    if (recipesError) {
      const errorInfo = handleError(recipesError);
      showErrorToast(errorInfo.message, {
        title: t('error.loadingRecipes'),
        duration: 7000
      });
    }
  }, [recipesError, handleError, showErrorToast, t]);

  const handleFilterChange = useCallback((newFilters: Partial<RecipeFiltersType & SortParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // Memoized calculations for performance
  const hasRecipes = useMemo(() => {
    return recipesData?.recipes && recipesData.recipes.length > 0;
  }, [recipesData?.recipes]);

  const paginationInfo = useMemo(() => {
    if (!recipesData?.pagination) return null;
    return {
      showPagination: recipesData.pagination.totalPages > 1,
      currentPage: recipesData.pagination.page,
      totalPages: recipesData.pagination.totalPages,
      hasPrev: recipesData.pagination.hasPrev,
      hasNext: recipesData.pagination.hasNext
    };
  }, [recipesData?.pagination]);

  if (recipesLoading) {
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
        <LoadingCard message={t('recipes.loading')} />
      </div>
    );
  }

  if (recipesError) {
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
        <ErrorMessage
          title={t('error.loadingRecipes')}
          message={recipesError instanceof Error ? recipesError.message : t('common.errorGeneric')}
          onRetry={() => refetchRecipes()}
          variant="card"
        />
      </div>
    );
  }

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

      {/* Filters */}
      <div className="mb-8">
        <RecipeFilters
          filters={filters}
          categories={categories}
          onFiltersChange={handleFilterChange}
        />
      </div>

      {/* Recipe Grid */}
      {hasRecipes ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {recipesData!.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {recipesData?.pagination && (
            <div className="space-y-4">
              {/* Results info */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                {recipesData.pagination.total > 0 ? (
                  t('common.showingResults', {
                    from: (recipesData.pagination.page - 1) * recipesData.pagination.limit + 1,
                    to: Math.min(recipesData.pagination.page * recipesData.pagination.limit, recipesData.pagination.total),
                    total: recipesData.pagination.total
                  })
                ) : (
                  t('common.noResults')
                )}
              </div>

              {/* Pagination controls */}
              {paginationInfo?.showPagination && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                    disabled={!paginationInfo.hasPrev}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('common.previous')}
                  </button>
                  
                  <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('common.pageOf', { 
                      current: paginationInfo.currentPage, 
                      total: paginationInfo.totalPages 
                    })}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                    disabled={!paginationInfo.hasNext}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('common.next')}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('recipes.noRecipes.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('recipes.noRecipes.description')}
          </p>
        </div>
      )}
    </div>
  );
}