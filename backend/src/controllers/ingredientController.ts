import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, sendSuccessResponse } from '../utils';

const prisma = new PrismaClient();

export const getIngredients = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { search, category } = req.query;

  const where: any = {};

  if (search) {
    where.name = {
      contains: search as string,
      mode: 'insensitive',
    };
  }

  if (category) {
    where.category = category as string;
  }

  const ingredients = await prisma.ingredient.findMany({
    where,
    orderBy: {
      name: 'asc',
    },
  });

  sendSuccessResponse(res, ingredients, 'Ingredients retrieved successfully');
});

export const getIngredientById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

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
    res.status(404).json({
      success: false,
      error: {
        message: 'Ingredient not found',
        statusCode: 404,
      },
    });
    return;
  }

  sendSuccessResponse(res, {
    message: 'Ingredient retrieved successfully',
    data: { ingredient },
  });
});