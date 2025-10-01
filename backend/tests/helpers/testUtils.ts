import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { expect } from '@jest/globals';

const prisma = new PrismaClient();

export interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string;
  token: string;
}

export interface TestRecipe {
  id: string;
  title: string;
  description: string | null;
  authorId: string;
}

export interface TestCategory {
  id: string;
  name: string;
}

export interface TestIngredient {
  id: string;
  name: string;
}

// Create test user
export async function createTestUser(overrides: Partial<{
  email: string;
  name: string;
  password: string;
}> = {}): Promise<TestUser> {
  const userData = {
    email: overrides.email || `test${Date.now()}@example.com`,
    name: overrides.name || 'Test User',
    password: overrides.password || 'password123',
  };

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: 'USER',
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role || 'USER' },
    process.env.JWT_SECRET || 'test-secret',
    { 
      expiresIn: '1h',
      issuer: 'recipehub-api',
      audience: 'recipehub-client'
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    password: userData.password,
    token,
  };
}

// Create test category
export async function createTestCategory(overrides: Partial<{
  name: string;
  description: string;
  type: string;
}> = {}): Promise<TestCategory> {
  const category = await prisma.category.create({
    data: {
      name: overrides.name || `Test Category ${Date.now()}`,
      description: overrides.description || 'Test category description',
      type: overrides.type || 'CUISINE',
    },
  });

  return {
    id: category.id,
    name: category.name,
  };
}

// Create test ingredient
export async function createTestIngredient(overrides: Partial<{
  name: string;
  category: string;
  unit: string;
}> = {}): Promise<TestIngredient> {
  const ingredient = await prisma.ingredient.create({
    data: {
      name: overrides.name || `Test Ingredient ${Date.now()}`,
      category: overrides.category || 'OTHER',
      unit: overrides.unit || 'piece',
    },
  });

  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}

// Create test recipe
export async function createTestRecipe(
  authorId: string,
  overrides: Partial<{
    title: string;
    description: string;
    instructions: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: string;
    isPublished: boolean;
  }> = {}
): Promise<TestRecipe> {
  const recipe = await prisma.recipe.create({
    data: {
      title: overrides.title || `Test Recipe ${Date.now()}`,
      description: overrides.description || 'Test recipe description',
      instructions: overrides.instructions || 'Test instructions',
      prepTime: overrides.prepTime || 30,
      cookTime: overrides.cookTime || 45,
      servings: overrides.servings || 4,
      difficulty: overrides.difficulty || 'MEDIUM',
      isPublished: overrides.isPublished ?? true,
      authorId,
    },
  });

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    authorId: recipe.authorId,
  };
}

// Create test comment
export async function createTestComment(
  recipeId: string,
  userId: string,
  overrides: Partial<{
    content: string;
    rating: number;
  }> = {}
) {
  return await prisma.comment.create({
    data: {
      content: overrides.content || 'Test comment content',
      rating: overrides.rating || 5,
      recipeId,
      userId,
    },
  });
}

// Generate auth header
export function getAuthHeader(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}

// Clean up test data
export async function cleanupTestData() {
  await prisma.comment.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.recipeLike.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeCategory.deleteMany();
  await prisma.recipeChef.deleteMany();
  await prisma.recipeStep.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.category.deleteMany();
  await prisma.chef.deleteMany();
}

// Validate response structure
export function expectValidResponse(response: any, expectedStatus: number) {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success');
  
  if (response.body.success) {
    expect(response.body).toHaveProperty('data');
  } else {
    expect(response.body).toHaveProperty('error');
  }
}

// Validate pagination response
export function expectValidPaginationResponse(response: any) {
  expectValidResponse(response, 200);
  expect(response.body.data).toHaveProperty('items');
  expect(response.body.data).toHaveProperty('pagination');
  expect(response.body.data.pagination).toHaveProperty('page');
  expect(response.body.data.pagination).toHaveProperty('limit');
  expect(response.body.data.pagination).toHaveProperty('total');
  expect(response.body.data.pagination).toHaveProperty('totalPages');
}

export { prisma };