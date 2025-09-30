import React from 'react';
import { useTranslation } from 'react-i18next';
import type { RecipeIngredient } from '../../types';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
  className?: string;
}

export const IngredientList: React.FC<IngredientListProps> = ({ 
  ingredients, 
  className = '' 
}) => {
  const { t } = useTranslation();

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 text-center py-4 ${className}`}>
        {t('recipes.noIngredients')}
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('recipes.ingredients')}
      </h3>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li 
            key={ingredient.id} 
            className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(() => {
                  const translatedName = t(`ingredients.${ingredient.ingredient.name}`, { defaultValue: null });
                  if (translatedName === null || translatedName === `ingredients.${ingredient.ingredient.name}`) {
                    return ingredient.ingredient.name;
                  }
                  return translatedName;
                })()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {ingredient.quantity} {ingredient.unit}
              </span>
              {ingredient.notes && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {ingredient.notes}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;