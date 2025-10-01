import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RecipeFilters as RecipeFiltersType, SortParams, DifficultyType, ComplexityType, FlavorTypeEnum, MealTypeEnum } from '../../types';

interface RecipeFiltersProps {
  filters: RecipeFiltersType & SortParams;
  categories?: Array<{ id: string; name: string }>;
  onFiltersChange: (filters: Partial<RecipeFiltersType & SortParams>) => void;
}

export const RecipeFilters = memo(function RecipeFilters({ filters, categories, onFiltersChange }: RecipeFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.difficulty')}
          </label>
          <select
            value={filters.difficulty || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ difficulty: (e.target.value as DifficultyType) || undefined })}
          >
            <option value="">{t('recipes.filters.allDifficulties')}</option>
            <option value="EASY">{t('recipes.difficulty.EASY')}</option>
            <option value="MEDIUM">{t('recipes.difficulty.MEDIUM')}</option>
            <option value="HARD">{t('recipes.difficulty.HARD')}</option>
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

        {/* Flavor Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.flavorType')}
          </label>
          <select
            value={filters.flavorType || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ flavorType: (e.target.value as FlavorTypeEnum) || undefined })}
          >
            <option value="">{t('recipes.filters.allFlavorTypes')}</option>
            <option value="SWEET">{t('recipes.flavorType.SWEET')}</option>
            <option value="SAVORY">{t('recipes.flavorType.SAVORY')}</option>
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

        {/* Low Calorie Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.lowCalorie')}
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isLowCalorie || false}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              onChange={(e) => onFiltersChange({ isLowCalorie: e.target.checked || undefined })}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('recipes.filters.lowCalorieOnly')}
            </span>
          </div>
        </div>

        {/* Max Calories Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('recipes.filters.maxCalories')}
          </label>
          <input
            type="number"
            value={filters.caloriesMax || ''}
            placeholder={t('recipes.filters.maxCaloriesPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            onChange={(e) => onFiltersChange({ caloriesMax: e.target.value ? parseInt(e.target.value) : undefined })}
          />
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
    </div>
  );
});