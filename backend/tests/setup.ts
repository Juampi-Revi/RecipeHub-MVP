import { beforeAll, afterAll, afterEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set NODE_ENV to test if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Create Prisma client
const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Test database connection established');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    // Don't throw error here, let individual tests handle it
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }
});

afterEach(async () => {
  // Clean up database tables if possible
  try {
    // Try to clean up common tables
    const tables = [
      'RecipeLike',
      'RecipeChef', 
      'RecipeIngredient',
      'RecipeCategory',
      'Rating',
      'Comment',
      'RecipeStep',
      'Recipe',
      'RefreshToken',
      'Ingredient',
      'Chef',
      'Category',
      'User'
    ];

    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
      } catch (error) {
        // Ignore errors for tables that don't exist or have constraints
      }
    }
  } catch (error) {
    // Ignore cleanup errors in tests
    console.log('Database cleanup skipped (this is normal for some test environments)');
  }
});

// Set Jest timeout
jest.setTimeout(30000);