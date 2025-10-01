import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../src/server';
import { 
  createTestUser, 
  createTestRecipe, 
  createTestCategory,
  createTestIngredient,
  cleanupTestData, 
  expectValidResponse, 
  expectValidPaginationResponse,
  getAuthHeader 
} from './helpers/testUtils';

describe('Recipe Endpoints', () => {
  let testUser: any;
  let testCategory: any;
  let testIngredient: any;

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser();
    testCategory = await createTestCategory();
    testIngredient = await createTestIngredient();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('GET /api/recipes', () => {
    beforeEach(async () => {
      // Create some test recipes
      await createTestRecipe(testUser.id, { title: 'Recipe 1', isPublished: true });
      await createTestRecipe(testUser.id, { title: 'Recipe 2', isPublished: true });
      await createTestRecipe(testUser.id, { title: 'Recipe 3', isPublished: false });
    });

    it('should get published recipes successfully', async () => {
      const response = await request(app)
        .get('/api/recipes');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/recipes?page=1&limit=1');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should support filtering by difficulty', async () => {
      await createTestRecipe(testUser.id, { 
        title: 'Easy Recipe', 
        difficulty: 'EASY',
        isPublished: true 
      });

      const response = await request(app)
        .get('/api/recipes?difficulty=EASY');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('POST /api/recipes', () => {
    it('should create a recipe successfully', async () => {
      const recipeData = {
        title: 'Test Recipe',
        description: 'A delicious test recipe',
        instructions: 'Mix ingredients and cook',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'MEDIUM',
        isPublished: true,
      };

      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeader(testUser.token))
        .send(recipeData);

      expectValidResponse(response, 400);
    });

    it('should fail without authentication', async () => {
      const recipeData = {
        title: 'Test Recipe',
        description: 'A test recipe',
        instructions: 'Cook it',
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        difficulty: 'MEDIUM',
      };

      const response = await request(app)
        .post('/api/recipes')
        .send(recipeData);

      expectValidResponse(response, 401);
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        title: '', // Empty title
        prepTime: -5, // Negative time
      };

      const response = await request(app)
        .post('/api/recipes')
        .set(getAuthHeader(testUser.token))
        .send(invalidData);

      expectValidResponse(response, 400);
    });
  });

  describe('GET /api/recipes/:recipeId', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id, { isPublished: true });
    });

    it('should get recipe by ID successfully', async () => {
      const response = await request(app)
        .get(`/api/recipes/${testRecipe.id}`);

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should fail with non-existent recipe ID', async () => {
      const response = await request(app)
        .get('/api/recipes/non-existent-id');

      expectValidResponse(response, 400);
    });
  });

  describe('PUT /api/recipes/:recipeId', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id);
    });

    it('should update recipe successfully', async () => {
      const updateData = {
        title: 'Updated Recipe Title',
        description: 'Updated description',
        prepTime: 20,
      };

      const response = await request(app)
        .put(`/api/recipes/${testRecipe.id}`)
        .set(getAuthHeader(testUser.token))
        .send(updateData);

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should fail when updating another user\'s recipe', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      
      const response = await request(app)
        .put(`/api/recipes/${testRecipe.id}`)
        .set(getAuthHeader(otherUser.token))
        .send({ title: 'Hacked Recipe' });

      expectValidResponse(response, 500);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/recipes/${testRecipe.id}`)
        .send({ title: 'Updated Title' });

      expectValidResponse(response, 401);
    });
  });

  describe('DELETE /api/recipes/:recipeId', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id);
    });

    it('should delete recipe successfully', async () => {
      const response = await request(app)
        .delete(`/api/recipes/${testRecipe.id}`)
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      
      // Verify recipe is deleted
      const getResponse = await request(app)
        .get(`/api/recipes/${testRecipe.id}`);
      
      expectValidResponse(getResponse, 404);
    });

    it('should fail when deleting another user\'s recipe', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      
      const response = await request(app)
        .delete(`/api/recipes/${testRecipe.id}`)
        .set(getAuthHeader(otherUser.token));

      expectValidResponse(response, 500);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/api/recipes/${testRecipe.id}`);

      expectValidResponse(response, 401);
    });
  });

  describe('GET /api/recipes/search', () => {
    beforeEach(async () => {
      await createTestRecipe(testUser.id, { 
        title: 'Chocolate Cake', 
        description: 'Delicious chocolate dessert',
        isPublished: true 
      });
      await createTestRecipe(testUser.id, { 
        title: 'Vanilla Ice Cream', 
        description: 'Creamy vanilla treat',
        isPublished: true 
      });
    });

    it('should search recipes by title', async () => {
      const response = await request(app)
        .get('/api/recipes/search?q=chocolate');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should search recipes by description', async () => {
      const response = await request(app)
        .get('/api/recipes/search?q=creamy');

      expectValidResponse(response, 200);
      expect(response.body.data).toBeDefined();
    });

    it('should fail without search query', async () => {
      const response = await request(app)
        .get('/api/recipes/search');

      expectValidResponse(response, 400);
    });
  });

  describe('POST /api/recipes/:recipeId/like', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id, { isPublished: true });
    });

    it('should like recipe successfully', async () => {
      const response = await request(app)
        .post(`/api/recipes/${testRecipe.id}/like`)
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('liked', true);
    });

    it('should unlike recipe when already liked', async () => {
      // First like
      await request(app)
        .post(`/api/recipes/${testRecipe.id}/like`)
        .set(getAuthHeader(testUser.token));

      // Then unlike
      const response = await request(app)
        .post(`/api/recipes/${testRecipe.id}/like`)
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('liked', false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/recipes/${testRecipe.id}/like`);

      expectValidResponse(response, 401);
    });
  });

  describe('GET /api/recipes/my', () => {
    beforeEach(async () => {
      await createTestRecipe(testUser.id, { title: 'My Recipe 1' });
      await createTestRecipe(testUser.id, { title: 'My Recipe 2' });
      
      // Create recipe by another user
      const otherUser = await createTestUser({ email: 'other@example.com' });
      await createTestRecipe(otherUser.id, { title: 'Other Recipe' });
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/recipes/my');

      expectValidResponse(response, 401);
    });
  });

  describe('PATCH /api/recipes/:recipeId/publish', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id, { isPublished: false });
    });

    it('should publish recipe successfully', async () => {
      const response = await request(app)
        .patch(`/api/recipes/${testRecipe.id}/publish`)
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data.isPublished).toBe(true);
    });

    it('should fail when publishing another user\'s recipe', async () => {
      const otherUser = await createTestUser({ email: 'other@example.com' });
      
      const response = await request(app)
        .patch(`/api/recipes/${testRecipe.id}/publish`)
        .set(getAuthHeader(otherUser.token));

      expectValidResponse(response, 500);
    });
  });

  describe('PATCH /api/recipes/:recipeId/unpublish', () => {
    let testRecipe: any;

    beforeEach(async () => {
      testRecipe = await createTestRecipe(testUser.id, { isPublished: true });
    });

    it('should unpublish recipe successfully', async () => {
      const response = await request(app)
        .patch(`/api/recipes/${testRecipe.id}/unpublish`)
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data.isPublished).toBe(false);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .patch(`/api/recipes/${testRecipe.id}/unpublish`);

      expectValidResponse(response, 401);
    });
  });
});