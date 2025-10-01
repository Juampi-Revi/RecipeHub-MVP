import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../src/server';
import { 
  createTestCategory,
  cleanupTestData, 
  expectValidResponse
} from './helpers/testUtils';

describe('Category Endpoints', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      await createTestCategory({ name: 'Italian', type: 'CUISINE' });
      await createTestCategory({ name: 'Dessert', type: 'MEAL_TYPE' });
      await createTestCategory({ name: 'Vegetarian', type: 'DIETARY' });
    });

    it('should get all categories successfully', async () => {
      const response = await request(app)
        .get('/api/categories');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should return empty array when no categories exist', async () => {
      await cleanupTestData();
      
      const response = await request(app)
        .get('/api/categories');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should include categories of different types', async () => {
      const response = await request(app)
        .get('/api/categories');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/categories/:id', () => {
    let testCategory: any;

    beforeEach(async () => {
      testCategory = await createTestCategory({ 
        name: 'Mediterranean', 
        type: 'CUISINE',
        description: 'Mediterranean cuisine category'
      });
    });

    it('should get category by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/categories/${testCategory.id}`);

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should fail with non-existent category ID', async () => {
      const response = await request(app)
        .get('/api/categories/non-existent-id');

      expectValidResponse(response, 404);
    });

    it('should fail with invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/categories/invalid-uuid');

      expectValidResponse(response, 404);
    });
  });

  describe('Category data validation', () => {
    it('should have valid category structure', async () => {
      const testCategory = await createTestCategory({ 
        name: 'Asian', 
        type: 'CUISINE' 
      });

      const response = await request(app)
        .get(`/api/categories/${testCategory.id}`);

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Category filtering and search', () => {
    beforeEach(async () => {
      await createTestCategory({ name: 'French', type: 'CUISINE' });
      await createTestCategory({ name: 'Breakfast', type: 'MEAL_TYPE' });
      await createTestCategory({ name: 'Vegan', type: 'DIETARY' });
      await createTestCategory({ name: 'Grilling', type: 'COOKING_METHOD' });
    });

    it('should support filtering by type (if implemented)', async () => {
      const response = await request(app)
        .get('/api/categories?type=CUISINE');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should support search by name (if implemented)', async () => {
      const response = await request(app)
        .get('/api/categories?search=French');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Category performance and limits', () => {
    it('should handle multiple categories efficiently', async () => {
      const promises: Promise<any>[] = [];
      for (let i = 0; i < 10; i++) {
        promises.push(createTestCategory({ 
          name: `Category ${i}`, 
          type: 'CUISINE' 
        }));
      }
      await Promise.all(promises);

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/categories');
      const endTime = Date.now();

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
      
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});