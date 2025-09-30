import { useState, useCallback } from 'react';
import type { 
  CreateRecipeRequest, 
  DifficultyType, 
  ComplexityType, 
  FlavorTypeEnum, 
  MealTypeEnum,
  CreateRecipeIngredientRequest 
} from '../types';

interface RecipeFormData {
  title: string;
  description: string;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: DifficultyType;
  estimatedCalories: number;
  complexity: ComplexityType;
  flavorType: FlavorTypeEnum;
  mealType: MealTypeEnum;
  isLowCalorie: boolean;
  categoryIds: string[];
  ingredients: CreateRecipeIngredientRequest[];
  imageUrl: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: RecipeFormData = {
  title: '',
  description: '',
  instructions: '',
  prepTime: 30,
  cookTime: 30,
  servings: 4,
  difficulty: 'easy' as DifficultyType,
  estimatedCalories: 300,
  complexity: 'EASY' as ComplexityType,
  flavorType: 'SAVORY' as FlavorTypeEnum,
  mealType: 'DINNER' as MealTypeEnum,
  isLowCalorie: false,
  categoryIds: [],
  ingredients: [],
  imageUrl: ''
};

export function useRecipeForm() {
  const [formData, setFormData] = useState<RecipeFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (formData.prepTime <= 0) {
      newErrors.prepTime = 'Prep time must be greater than 0';
    }

    if (formData.cookTime <= 0) {
      newErrors.cookTime = 'Cook time must be greater than 0';
    }

    if (formData.servings <= 0) {
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
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));

    if (errors.categoryIds) {
      setErrors(prev => ({ ...prev, categoryIds: '' }));
    }
  }, [errors.categoryIds]);

  const handleIngredientChange = useCallback((ingredientId: string) => {
    const isCurrentlySelected = selectedIngredients.includes(ingredientId);
    
    setSelectedIngredients(prev => 
      isCurrentlySelected
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );

    setFormData(prev => {
      const newIngredients = isCurrentlySelected
        ? prev.ingredients.filter(ing => ing.ingredientId !== ingredientId)
        : [...prev.ingredients, {
            ingredientId,
            quantity: 1,
            unit: 'unit'
          }];
      
      return {
        ...prev,
        ingredients: newIngredients
      };
    });

    if (errors.ingredients) {
      setErrors(prev => ({ ...prev, ingredients: '' }));
    }
  }, [selectedIngredients, errors.ingredients]);

  const getFormDataForSubmission = useCallback((): CreateRecipeRequest => {
    return {
      ...formData,
      description: formData.description || undefined,
      estimatedCalories: formData.estimatedCalories || undefined
    };
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSelectedIngredients([]);
  }, []);

  return {
    formData,
    errors,
    selectedIngredients,
    validateForm,
    handleInputChange,
    handleCategoryChange,
    handleIngredientChange,
    getFormDataForSubmission,
    resetForm
  };
}