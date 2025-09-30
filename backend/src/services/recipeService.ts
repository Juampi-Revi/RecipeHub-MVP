import { PrismaClient, Recipe, Prisma } from '@prisma/client';
import { 
  CreateRecipeInput, 
  UpdateRecipeInput, 
  PaginationInput, 
  RecipeFiltersInput, 
  RecipeSortInput 
} from '../utils/validation';

const prisma = new PrismaClient();

export interface RecipeWithDetails extends Recipe {
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  categories: Array<{
    id: string;
    category: {
      id: string;
      name: string;
      type: string;
      color?: string;
    };
  }>;
  ingredients: Array<{
    id: string;
    quantity: number;
    unit?: string;
    notes?: string;
    ingredient: {
      id: string;
      name: string;
      category: string;
      unit: string;
    };
  }>;
  chefs: Array<{
    id: string;
    chef: {
      id: string;
      name: string;
      bio?: string;
      imageUrl?: string;
      specialties?: string;
      yearsExperience?: number;
      isVerified: boolean;
    };
  }>;
  _count: {
    likes: number;
    comments: number;
    ratings: number;
  };
  avgRating?: number;
}

export interface RecipeListResponse {
  recipes: RecipeWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

function createPaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

class RecipeService {
  private getRecipeInclude() {
    return {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              type: true,
              color: true,
            },
          },
        },
      },
      ingredients: {
        include: {
          ingredient: {
            select: {
              id: true,
              name: true,
              category: true,
              unit: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc' as const,
        },
      },
      chefs: {
        include: {
          chef: {
            select: {
              id: true,
              name: true,
              bio: true,
              imageUrl: true,
              specialties: true,
              yearsExperience: true,
              isVerified: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          ratings: true,
        },
      },
    };
  }

  private buildWhereClause(filters: RecipeFiltersInput): Prisma.RecipeWhereInput {
    const where: Prisma.RecipeWhereInput = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { instructions: { contains: filters.search } },
        {
          ingredients: {
            some: {
              ingredient: {
                name: { contains: filters.search },
              },
            },
          },
        },
      ];
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categories = {
        some: {
          categoryId: { in: filters.categoryIds },
        },
      };
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters.maxPrepTime) {
      where.prepTime = { lte: filters.maxPrepTime };
    }

    if (filters.maxCookTime) {
      where.cookTime = { lte: filters.maxCookTime };
    }

    if (filters.maxCalories) {
      where.estimatedCalories = { lte: filters.maxCalories };
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    if (filters.hasIngredients && filters.hasIngredients.length > 0) {
      where.ingredients = {
        some: {
          ingredientId: { in: filters.hasIngredients },
        },
      };
    }

    return where;
  }

  private buildOrderBy(sort: RecipeSortInput): Prisma.RecipeOrderByWithRelationInput[] {
    const orderBy: Prisma.RecipeOrderByWithRelationInput[] = [];

    switch (sort.sortBy) {
      case 'title':
        orderBy.push({ title: sort.sortOrder });
        break;
      case 'prepTime':
        orderBy.push({ prepTime: sort.sortOrder });
        break;
      case 'cookTime':
        orderBy.push({ cookTime: sort.sortOrder });
        break;
      case 'totalTime':
        orderBy.push({ prepTime: sort.sortOrder });
        orderBy.push({ cookTime: sort.sortOrder });
        break;
      case 'difficulty':
        orderBy.push({ difficulty: sort.sortOrder });
        break;
      case 'likes':
        orderBy.push({ likes: { _count: sort.sortOrder } });
        break;
      case 'rating':
        orderBy.push({ ratings: { _count: sort.sortOrder } });
        break;
      case 'updatedAt':
        orderBy.push({ updatedAt: sort.sortOrder });
        break;
      case 'createdAt':
      default:
        orderBy.push({ createdAt: sort.sortOrder });
        break;
    }

    return orderBy;
  }

  async createRecipe(data: CreateRecipeInput, authorId: string): Promise<RecipeWithDetails> {
    const { categoryIds, ingredients, ...recipeData } = data;

    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        authorId,
        categories: {
          create: categoryIds.map(categoryId => ({
            categoryId,
          })),
        },
        ingredients: {
          create: ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            notes: ingredient.notes,
          })),
        },
      },
      include: this.getRecipeInclude(),
    });

    return this.addAverageRating(recipe);
  }

  async getRecipes(
    filters: RecipeFiltersInput = {},
    pagination: PaginationInput = {},
    sort: RecipeSortInput = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<RecipeListResponse> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(sort);

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: this.getRecipeInclude(),
        orderBy,
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    const recipesWithRating = await Promise.all(
      recipes.map(recipe => this.addAverageRating(recipe))
    );

    return {
      recipes: recipesWithRating,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  async getRecipeById(id: string): Promise<RecipeWithDetails | null> {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: this.getRecipeInclude(),
    });

    if (!recipe) return null;

    return this.addAverageRating(recipe);
  }

  async updateRecipe(
    id: string,
    data: UpdateRecipeInput,
    userId: string
  ): Promise<RecipeWithDetails> {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }

    if (existingRecipe.authorId !== userId) {
      throw new Error('Not authorized to update this recipe');
    }

    const { categoryIds, ingredients, ...recipeData } = data;

    const updateData: Prisma.RecipeUpdateInput = { ...recipeData };

    if (categoryIds) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map(categoryId => ({
          categoryId,
        })),
      };
    }

    if (ingredients) {
      updateData.ingredients = {
        deleteMany: {},
        create: ingredients.map(ingredient => ({
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: ingredient.notes,
        })),
      };
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
      include: this.getRecipeInclude(),
    });

    return this.addAverageRating(recipe);
  }

  async deleteRecipe(id: string, userId: string): Promise<void> {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }

    if (existingRecipe.authorId !== userId) {
      throw new Error('Not authorized to delete this recipe');
    }

    await prisma.recipe.delete({
      where: { id },
    });
  }

  async searchRecipes(
    query: string,
    filters: RecipeFiltersInput = {},
    pagination: PaginationInput = {},
    sort: RecipeSortInput = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<RecipeListResponse> {
    const searchFilters = { ...filters, search: query };
    return this.getRecipes(searchFilters, pagination, sort);
  }

  async getRecipesByAuthor(
    authorId: string,
    pagination: PaginationInput = {},
    sort: RecipeSortInput = { sortBy: 'createdAt', sortOrder: 'desc' }
  ): Promise<RecipeListResponse> {
    const filters = { authorId };
    return this.getRecipes(filters, pagination, sort);
  }

  async toggleLike(recipeId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const existingLike = await prisma.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existingLike) {
      await prisma.recipeLike.delete({
        where: {
          userId_recipeId: {
            userId,
            recipeId,
          },
        },
      });
    } else {
      await prisma.recipeLike.create({
        data: {
          userId,
          recipeId,
        },
      });
    }

    const likesCount = await prisma.recipeLike.count({
      where: { recipeId },
    });

    return {
      liked: !existingLike,
      likesCount,
    };
  }

  private async addAverageRating(recipe: any): Promise<RecipeWithDetails> {
    const ratings = await prisma.rating.findMany({
      where: { recipeId: recipe.id },
      select: { rating: true },
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : undefined;

    return {
      ...recipe,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
    };
  }
}

export default new RecipeService();