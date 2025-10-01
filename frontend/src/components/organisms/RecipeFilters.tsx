import { memo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { RecipeFilters as RecipeFiltersType, SortParams, ComplexityType, MealTypeEnum } from '../../types';

interface RecipeFiltersProps {
  filters: RecipeFiltersType & SortParams;
  categories?: Array<{ id: string; name: string }>;
  onFiltersChange: (filters: Partial<RecipeFiltersType & SortParams>) => void;
}

export const RecipeFilters = memo(function RecipeFilters({ filters, categories, onFiltersChange }: RecipeFiltersProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Sincronizar el estado local con los filtros externos
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: undefined,
      category: undefined,
      complexity: undefined,
      mealType: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFiltersChange({ search: searchInput || undefined });
    }
  };

  const hasActiveFilters = filters.search || filters.category || filters.complexity || filters.mealType;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            placeholder={t('recipes.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-lg"
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.category')}
          </label>
          <select
            value={filters.category || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ category: e.target.value || undefined })}
          >
            <option value="">{t('recipes.filters.allCategories')}</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Complexity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.complexity')}
          </label>
          <select
            value={filters.complexity || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ complexity: (e.target.value as ComplexityType) || undefined })}
          >
            <option value="">{t('recipes.filters.allComplexities')}</option>
            <option value="EASY">{t('recipes.complexity.EASY')}</option>
            <option value="MEDIUM">{t('recipes.complexity.MEDIUM')}</option>
            <option value="HARD">{t('recipes.complexity.HARD')}</option>
          </select>
        </div>

        {/* Meal Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.mealType')}
          </label>
          <select
            value={filters.mealType || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ mealType: (e.target.value as MealTypeEnum) || undefined })}
          >
            <option value="">{t('recipes.filters.allMealTypes')}</option>
            <option value="BREAKFAST">{t('recipes.mealType.BREAKFAST')}</option>
            <option value="LUNCH">{t('recipes.mealType.LUNCH')}</option>
            <option value="SNACK">{t('recipes.mealType.SNACK')}</option>
            <option value="DINNER">{t('recipes.mealType.DINNER')}</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.sortBy')}
          </label>
          <select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              onFiltersChange({ 
                sortBy: sortBy as 'createdAt' | 'title' | 'prepTime' | 'cookTime' | 'rating', 
                sortOrder: sortOrder as 'asc' | 'desc' 
              });
            }}
          >
            <option value="createdAt:desc">{t('recipes.sort.newest')}</option>
            <option value="createdAt:asc">{t('recipes.sort.oldest')}</option>
            <option value="title:asc">{t('recipes.sort.nameAZ')}</option>
            <option value="title:desc">{t('recipes.sort.nameZA')}</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
});