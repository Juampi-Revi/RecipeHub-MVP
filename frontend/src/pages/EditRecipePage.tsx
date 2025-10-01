import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipe, useUpdateRecipe, useCategories, useIngredients } from '../hooks/useRecipes';
import { useToast } from '../hooks/useToast';
import { FormInput } from '../components/atoms/FormInput';
import { FormTextarea } from '../components/atoms/FormTextarea';
import { FormSelect } from '../components/atoms/FormSelect';
import { ImageUrlField } from '../components/molecules/ImageUrlField';
import { useTranslation } from 'react-i18next';
import type { DifficultyType, UpdateRecipeRequest, CreateRecipeIngredientRequest } from '../types';

interface EditFormData {
  title: string;
  description: string;
  instructions: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: DifficultyType;
  imageUrl: string;
  categoryIds: string[];
  ingredients: CreateRecipeIngredientRequest[];
}

export function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { success: showSuccess, error: showError } = useToast();
  
  const { data: recipe, isLoading: isLoadingRecipe, error: recipeError } = useRecipe(id!);
  const updateRecipeMutation = useUpdateRecipe();
  const { data: categories = [] } = useCategories();
  const { data: ingredients = [] } = useIngredients();

  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    description: '',
    instructions: '',
    prepTime: '30',
    cookTime: '30',
    servings: '4',
    difficulty: 'EASY',
    imageUrl: '',
    categoryIds: [],
    ingredients: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load recipe data into form when recipe is fetched
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        instructions: recipe.instructions,
        prepTime: recipe.prepTime.toString(),
        cookTime: recipe.cookTime.toString(),
        servings: recipe.servings.toString(),
        difficulty: recipe.difficulty,
        imageUrl: recipe.imageUrl || '',
        categoryIds: recipe.categories.map(cat => cat.category.id),
        ingredients: recipe.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit || 'unit'
        }))
      });
    }
  }, [recipe]);

  useEffect(() => {
    if (!user) {
      showError('You must be logged in to edit recipes.');
      navigate('/login');
      return;
    }

    if (recipe && recipe.authorId !== user.id) {
      showError('You can only edit your own recipes.');
      navigate('/profile/my-recipes');
      return;
    }
  }, [user, recipe, navigate, showError]);

  useEffect(() => {
    if (recipeError) {
      showError('Recipe not found.');
      navigate('/profile/my-recipes');
    }
  }, [recipeError, navigate, showError]);

  if (!user || !id) {
    return null;
  }

  if (isLoadingRecipe) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (parseInt(formData.prepTime) <= 0) {
      newErrors.prepTime = 'Prep time must be greater than 0';
    }

    if (parseInt(formData.cookTime) <= 0) {
      newErrors.cookTime = 'Cook time must be greater than 0';
    }

    if (parseInt(formData.servings) <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'Select at least one category';
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'Add at least one ingredient';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));

    if (errors.categoryIds) {
      setErrors(prev => ({ ...prev, categoryIds: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const currentErrors = Object.entries(errors).filter(([, value]) => value);
      if (currentErrors.length > 0) {
        showError(`Please fix the following errors: ${currentErrors.map(([key]) => key).join(', ')}`);
      }
      return;
    }

    try {
      const submissionData: UpdateRecipeRequest = {
        title: formData.title,
        description: formData.description || undefined,
        instructions: formData.instructions,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        difficulty: formData.difficulty,
        imageUrl: formData.imageUrl || undefined,
        categoryIds: formData.categoryIds,
        ingredients: formData.ingredients
      };

      await updateRecipeMutation.mutateAsync({ 
        id: id!, 
        data: submissionData 
      });
      
      showSuccess('Recipe updated successfully!');
      navigate('/profile/my-recipes');
    } catch (error: unknown) {
      console.error('Error updating recipe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update recipe. Please try again.';
      showError(errorMessage);
    }
  };

  const ingredientOptions = ingredients.map(ing => ({
    value: ing.id,
    label: ing.name
  }));

  const difficultyOptions = [
    { value: 'EASY', label: t('recipes.difficulty.EASY') },
    { value: 'MEDIUM', label: t('recipes.difficulty.MEDIUM') },
    { value: 'HARD', label: t('recipes.difficulty.HARD') }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/profile/my-recipes')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Recipes
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Recipe: {recipe.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update your recipe details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormInput
                id="title"
                label="Recipe Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Enter recipe title"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <FormTextarea
                id="description"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={errors.description}
                placeholder="Brief description of your recipe"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
              {errors.categoryIds && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.categoryIds}
                </p>
              )}
            </div>

            <FormSelect
              id="difficulty"
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              options={difficultyOptions}
              error={errors.difficulty}
              required
            />

            <FormInput
              id="prepTime"
              label="Prep Time (minutes)"
              name="prepTime"
              type="number"
              value={formData.prepTime}
              onChange={handleInputChange}
              error={errors.prepTime}
              placeholder="30"
              min="1"
              required
            />

            <FormInput
              id="cookTime"
              label="Cook Time (minutes)"
              name="cookTime"
              type="number"
              value={formData.cookTime}
              onChange={handleInputChange}
              error={errors.cookTime}
              placeholder="45"
              min="1"
              required
            />

            <FormInput
              id="servings"
              label="Servings"
              name="servings"
              type="number"
              value={formData.servings}
              onChange={handleInputChange}
              error={errors.servings}
              placeholder="4"
              min="1"
              required
            />

            <div className="md:col-span-1">
              <ImageUrlField
                value={formData.imageUrl}
                onChange={handleInputChange}
                error={errors.imageUrl}
              />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Ingredients
          </h2>
          
          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <select
                  value={ingredient.ingredientId}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index] = { ...newIngredients[index], ingredientId: e.target.value };
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select ingredient</option>
                  {ingredientOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index] = { ...newIngredients[index], quantity: parseFloat(e.target.value) || 0 };
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  placeholder="Amount"
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                
                <input
                  type="text"
                  value={ingredient.unit || ''}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index] = { ...newIngredients[index], unit: e.target.value };
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  placeholder="Unit"
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                
                <button
                  type="button"
                  onClick={() => {
                    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newIngredients = [...formData.ingredients, { ingredientId: '', quantity: 1, unit: 'unit' }];
                setFormData(prev => ({ ...prev, ingredients: newIngredients }));
              }}
              className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Instructions
          </h2>
          
          <FormTextarea
            id="instructions"
            label=""
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            error={errors.instructions}
            placeholder="Step-by-step cooking instructions..."
            rows={8}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/profile/my-recipes')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateRecipeMutation.isPending}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {updateRecipeMutation.isPending ? 'Updating...' : 'Update Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}