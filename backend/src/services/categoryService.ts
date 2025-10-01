import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export interface CategoryWithRecipes {
  id: string;
  name: string;
  description?: string | null;
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

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getCategoryById(id: string): Promise<CategoryWithRecipes> {
    const category = await prisma.category.findUnique({
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

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }
}

export const categoryService = new CategoryService();