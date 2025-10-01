import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';
import { useAuth } from './useAuth';
import type { 
  CreateRecipeRequest, 
  UpdateRecipeRequest, 
  RecipeFilters,
  PaginationParams,
  SortParams
} from '../types';

// Query keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: RecipeFilters & PaginationParams & SortParams) => 
    [...recipeKeys.lists(), filters] as const,
  myRecipes: () => [...recipeKeys.all, 'my'] as const,
  favorites: () => [...recipeKeys.all, 'favorites'] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  search: (query: string) => [...recipeKeys.all, 'search', query] as const,
  categories: () => [...recipeKeys.all, 'categories'] as const,
  ingredients: () => [...recipeKeys.all, 'ingredients'] as const,
  ratings: (id: string) => [...recipeKeys.detail(id), 'ratings'] as const,
};

// Hooks for queries
export function useRecipes(
  filters: RecipeFilters & PaginationParams & SortParams = {}
) {
  // Por defecto, mostrar solo recetas publicadas
  const filtersWithDefaults = {
    isPublished: true,
    ...filters
  };
  
  return useQuery({
    queryKey: recipeKeys.list(filtersWithDefaults),
    queryFn: () => recipeService.getRecipes(filtersWithDefaults),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipeService.getRecipeById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchRecipes(query: string) {
  return useQuery({
    queryKey: recipeKeys.search(query),
    queryFn: () => recipeService.searchRecipes({ search: query }),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useMyRecipes(
  params: PaginationParams & SortParams = {}
) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: recipeKeys.myRecipes(),
    queryFn: () => recipeService.getMyRecipes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user, // Only execute when user is authenticated
  });
}

export function useFavoriteRecipes(
  params: PaginationParams & SortParams = {}
) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: recipeKeys.favorites(),
    queryFn: () => recipeService.getFavoriteRecipes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user, // Only execute when user is authenticated
  });
}

export function useCategories() {
  return useQuery({
    queryKey: recipeKeys.categories(),
    queryFn: () => recipeService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useIngredients() {
  return useQuery({
    queryKey: recipeKeys.ingredients(),
    queryFn: () => recipeService.getIngredients(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useRecipeRatings(recipeId: string) {
  return useQuery({
    queryKey: recipeKeys.ratings(recipeId),
    queryFn: () => recipeService.getRecipeRatings(recipeId),
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hooks for mutations
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeRequest) => {
      // Establecer isPublished: true por defecto para que las recetas aparezcan inmediatamente
      const recipeData = {
        ...data,
        isPublished: data.isPublished !== undefined ? data.isPublished : true
      };
      return recipeService.createRecipe(recipeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeRequest }) =>
      recipeService.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.myRecipes() });
    },
  });
}

export function useRateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, rating, comment }: { 
      recipeId: string; 
      rating: number; 
      comment?: string; 
    }) => recipeService.rateRecipe(recipeId, rating, comment),
    onSuccess: (_, { recipeId }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(recipeId) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.ratings(recipeId) });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => recipeService.toggleLike(recipeId),
    onSuccess: () => {
      // Invalidate all recipe-related queries to update like counts and status
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}