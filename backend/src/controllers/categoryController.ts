import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, sendSuccessResponse } from '../utils';

const prisma = new PrismaClient();

export const getCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  sendSuccessResponse(res, categories, 'Categories retrieved successfully');
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

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
    res.status(404).json({
      success: false,
      error: {
        message: 'Category not found',
        statusCode: 404,
      },
    });
    return;
  }

  sendSuccessResponse(res, {
    message: 'Category retrieved successfully',
    data: { category },
  });
});