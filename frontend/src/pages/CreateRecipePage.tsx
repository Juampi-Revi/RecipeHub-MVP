import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCreateRecipe, useCategories, useIngredients } from '../hooks/useRecipes';
import { useToast } from '../hooks/useToast';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { FormInput } from '../components/atoms/FormInput';
import { FormTextarea } from '../components/atoms/FormTextarea';
import { FormSelect } from '../components/atoms/FormSelect';
import { ImageUrlField } from '../components/molecules/ImageUrlField';

export function CreateRecipePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const createRecipeMutation = useCreateRecipe();
  const { data: categories = [] } = useCategories();
  const { data: ingredients = [] } = useIngredients();

  const {
    formData,
    errors,
    selectedIngredients,
    validateForm,
    handleInputChange,
    handleCategoryChange,
    handleIngredientChange,
    getFormDataForSubmission,
    resetForm
  } = useRecipeForm();

  useEffect(() => {
    if (!user) {
      showError('You must be logged in to create recipes.');
      navigate('/login');
    }
  }, [user, navigate, showError]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Get current errors and show specific messages
      const currentErrors = Object.entries(errors).filter(([, value]) => value);
      if (currentErrors.length > 0) {
        const errorMessages = currentErrors.map(([field, message]) => {
          const fieldNames: { [key: string]: string } = {
            title: 'Título',
            description: 'Descripción',
            instructions: 'Instrucciones',
            imageUrl: 'URL de imagen',
            prepTime: 'Tiempo de preparación',
            cookTime: 'Tiempo de cocción',
            servings: 'Porciones',
            categoryIds: 'Categorías',
            ingredients: 'Ingredientes'
          };
          return `• ${fieldNames[field] || field}: ${message}`;
        }).join('\n');
        
        showError(`Por favor corrige los siguientes errores:\n${errorMessages}`);
      } else {
        showError('Por favor corrige los errores en el formulario antes de continuar.');
      }
      return;
    }

    try {
      const recipeData = getFormDataForSubmission();
      await createRecipeMutation.mutateAsync(recipeData);
      resetForm();
      showSuccess('¡Receta creada exitosamente!');
      navigate('/recipes');
    } catch (error: unknown) {
      console.error('Error creating recipe:', error);
      
      // Handle specific validation errors from backend
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { details?: Array<{ field: string; message: string }> } } };
        const backendErrors = responseError.response?.data?.details;
        
        if (backendErrors) {
          let errorMessage = 'Errores de validación:\n';
          
          backendErrors.forEach((err) => {
            switch (err.field) {
              case 'instructions':
                errorMessage += `• Instructions must be at least 10 characters long\n`;
                break;
              case 'imageUrl':
                errorMessage += `• The image URL is not valid\n`;
                break;
              case 'title':
                errorMessage += `• Title is required and must be between 3-100 characters\n`;
                break;
              case 'categoryIds':
                errorMessage += `• You must select at least one category\n`;
                break;
              case 'ingredients':
                errorMessage += `• You must add at least one ingredient\n`;
                break;
              default:
                errorMessage += `• ${err.field}: ${err.message}\n`;
            }
          });
          
          showError(errorMessage);
        } else {
          showError('Validation error. Please check all fields.');
        }
      } else {
        showError('Error creating recipe. Please check all fields and try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          Create New Recipe
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Share your favorite recipes with the community
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            label="Recipe Title"
            placeholder="Recipe name"
            required
            error={errors.title}
          />

          <FormTextarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Description (optional)"
            placeholder="Brief description of the recipe (minimum 10 characters if provided)"
            rows={3}
            error={errors.description}
          />

          <ImageUrlField
              value={formData.imageUrl}
              onChange={handleInputChange}
              error={errors.imageUrl}
            />

          <FormTextarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            label="Instructions"
            placeholder="Detailed steps to prepare the recipe (minimum 10 characters required)"
            rows={6}
            required
            error={errors.instructions}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              id="prepTime"
              name="prepTime"
              type="number"
              value={formData.prepTime}
              onChange={handleInputChange}
              label="Prep Time (min)"
              min="1"
              required
              error={errors.prepTime}
            />

            <FormInput
              id="cookTime"
              name="cookTime"
              type="number"
              value={formData.cookTime}
              onChange={handleInputChange}
              label="Cook Time (min)"
              min="1"
              required
              error={errors.cookTime}
            />

            <FormInput
              id="servings"
              name="servings"
              type="number"
              value={formData.servings}
              onChange={handleInputChange}
              label="Servings"
              min="1"
              required
              error={errors.servings}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              label="Difficulty"
              options={[
                { value: 'EASY', label: 'Easy' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HARD', label: 'Hard' }
              ]}
            />

            <FormSelect
              id="complexity"
              name="complexity"
              value={formData.complexity}
              onChange={handleInputChange}
              label="Complexity"
              options={[
                { value: 'EASY', label: 'Easy' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HARD', label: 'Hard' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="flavorType"
              name="flavorType"
              value={formData.flavorType}
              onChange={handleInputChange}
              label="Flavor Type"
              options={[
                { value: 'SAVORY', label: 'Savory' },
                { value: 'SWEET', label: 'Sweet' }
              ]}
            />

            <FormSelect
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleInputChange}
              label="Meal Type"
              options={[
                { value: 'BREAKFAST', label: 'Breakfast' },
                { value: 'LUNCH', label: 'Lunch' },
                { value: 'SNACK', label: 'Snack' },
                { value: 'DINNER', label: 'Dinner' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="estimatedCalories"
              name="estimatedCalories"
              type="number"
              value={formData.estimatedCalories}
              onChange={handleInputChange}
              label="Estimated Calories"
              min="0"
            />

            <div className="flex items-center">
              <input
                id="isLowCalorie"
                name="isLowCalorie"
                type="checkbox"
                checked={formData.isLowCalorie}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isLowCalorie" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Low Calorie
              </label>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="label">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.categoryIds && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryIds}</p>
            )}
          </div>

          {/* Ingredientes */}
          <div>
            <label className="label">
              Ingredientes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {ingredients.map((ingredient) => (
                <label key={ingredient.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleIngredientChange(ingredient.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {ingredient.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/recipes')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRecipeMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}