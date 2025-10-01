import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export interface IngredientSearchParams {
  search?: string;
  category?: string;
}

export interface IngredientWithRecipes {
  id: string;
  name: string;
  category: string;
  unit: string;
  recipes: {
    recipe: {
      id: string;
      title: string;
      description: string | null;
      imageUrl: string | null;
      prepTime: number;
      cookTime: number;
      difficulty: string;
      author: {
        id: string;
        name: string;
      };
    };
  }[];
}

export class IngredientService {
  async getAllIngredients(params: IngredientSearchParams = {}) {
    const { search, category } = params;
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = category;
    }

    return await prisma.ingredient.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getIngredientById(id: string): Promise<IngredientWithRecipes> {
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: {
        recipes: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                prepTime: true,
                cookTime: true,
                difficulty: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!ingredient) {
      throw new NotFoundError('Ingredient not found');
    }

    return ingredient;
  }
}

export const ingredientService = new IngredientService();