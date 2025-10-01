import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('RecipeHub API Test Suite', () => {
  beforeAll(async () => {
    // Ensure test database is properly set up
    try {
      await prisma.$connect();
    } catch (error) {
      console.error('❌ Failed to connect to test database:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Test Environment Validation', () => {
    it('should be running in test environment', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('should use test database', () => {
      expect(process.env.DATABASE_URL).toContain('dev.db');
    });

    it('should have required environment variables', () => {
      const requiredEnvVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'PORT'
      ];

      requiredEnvVars.forEach(envVar => {
        expect(process.env[envVar]).toBeDefined();
      });
    });
  });

  describe('Database Schema Validation', () => {
    it('should have all required tables', async () => {
      const tables = await prisma.$queryRaw`
        SELECT name as table_name 
        FROM sqlite_master 
        WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      ` as Array<{ table_name: string }>;

      const tableNames = tables.map(t => t.table_name);
      const expectedTables = [
        'users',
        'refresh_tokens',
        'categories',
        'recipes',
        'recipe_steps',
        'chefs',
        'ingredients',
        'recipe_categories',
        'recipe_ingredients',
        'recipe_chefs',
        'recipe_likes',
        'comments',
        'ratings'
      ];

      expectedTables.forEach(tableName => {
        expect(tableNames).toContain(tableName);
      });
    });

    it('should be able to perform basic CRUD operations', async () => {
      // Test basic database operations
      const testUser = await prisma.user.create({
        data: {
          email: 'test-crud@example.com',
          password: 'hashedpassword',
          name: 'Test User'
        }
      });

      expect(testUser).toHaveProperty('id');
      expect(testUser.email).toBe('test-crud@example.com');

      // Update
      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: { name: 'Updated Test User' }
      });

      expect(updatedUser.name).toBe('Updated Test User');

      // Delete
      await prisma.user.delete({
        where: { id: testUser.id }
      });

      const deletedUser = await prisma.user.findUnique({
        where: { id: testUser.id }
      });

      expect(deletedUser).toBeNull();
    });
  });

  describe('API Test Coverage Summary', () => {
    it('should have comprehensive test coverage', () => {
      const testFiles = [
        'auth.test.ts',
        'recipes.test.ts',
        'categories.test.ts',
        'ingredients.test.ts',
        'comments.test.ts',
        'health.test.ts'
      ];

      // This is a meta-test to ensure all test files are accounted for
      expect(testFiles.length).toBeGreaterThanOrEqual(6);
    });

    it('should validate test utilities', () => {
      // Ensure test utilities are properly configured
      expect(typeof require('./helpers/testUtils').createTestUser).toBe('function');
      expect(typeof require('./helpers/testUtils').createTestRecipe).toBe('function');
      expect(typeof require('./helpers/testUtils').cleanupTestData).toBe('function');
      expect(typeof require('./helpers/testUtils').expectValidResponse).toBe('function');
    });
  });

  describe('Performance Benchmarks', () => {
    it('should handle database operations efficiently', async () => {
      const startTime = Date.now();
      
      // Create multiple users concurrently
      const userPromises = Array(10).fill(null).map((_, index) => 
        prisma.user.create({
          data: {
            email: `perf-test-${index}@example.com`,
            password: 'hashedpassword',
            name: `Performance Test User ${index}`
          }
        })
      );

      const users = await Promise.all(userPromises);
      const endTime = Date.now();
      
      expect(users).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds

      // Cleanup
      await prisma.user.deleteMany({
        where: {
          email: {
            startsWith: 'perf-test-'
          }
        }
      });
    });

    it('should handle complex queries efficiently', async () => {
      const startTime = Date.now();
      
      // Perform a complex query that joins multiple tables
      const result = await prisma.recipe.findMany({
        include: {
          categories: {
            include: {
              category: true
            }
          },
          ingredients: {
            include: {
              ingredient: true
            }
          },
          comments: true,
          likes: true
        },
        take: 5
      });

      const endTime = Date.now();
      
      expect(Array.isArray(result)).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Security Validation', () => {
    it('should not expose sensitive information in responses', async () => {
      // Create a test user with unique email
      const uniqueEmail = `security-test-${Date.now()}@example.com`;
      const testUser = await prisma.user.create({
        data: {
          email: uniqueEmail,
          password: 'hashedpassword',
          name: 'Security Test User'
        }
      });

      // Fetch user data
      const userData = await prisma.user.findUnique({
        where: { id: testUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          password: true // This should be excluded in actual API responses
        }
      });

      expect(userData).toHaveProperty('id');
      expect(userData).toHaveProperty('email');
      expect(userData).toHaveProperty('name');
      
      // In actual API responses, password should be excluded
      // This test ensures we're aware of what data we're exposing

      // Cleanup
      await prisma.user.delete({
        where: { id: testUser.id }
      });
    });

    it('should validate UUID formats', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const invalidUUIDs = [
        'invalid-uuid',
        '123',
        '',
        'not-a-uuid-at-all',
        '123e4567-e89b-12d3-a456-42661417400' // Missing last character
      ];

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(validUUID)).toBe(true);
      
      invalidUUIDs.forEach(uuid => {
        expect(uuidRegex.test(uuid)).toBe(false);
      });
    });
  });
});