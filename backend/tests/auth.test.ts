import request from 'supertest';
import { describe, it, beforeEach, afterAll, expect } from '@jest/globals';
import app from '../src/server';
import { createTestUser, cleanupTestData, expectValidResponse, getAuthHeader } from './helpers/testUtils';

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidResponse(response, 201);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidResponse(response, 500);
      expect(response.body.error.message).toContain('email');
    });

    it('should fail with weak password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidResponse(response, 500);
      expect(response.body.error.message).toContain('password');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expectValidResponse(response, 409);
      expect(response.body.error.message).toContain('email');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await createTestUser({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('tokens');
      expect(response.body.data.tokens).toHaveProperty('accessToken');
      expect(response.body.data.tokens).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        });

      expectValidResponse(response, 401);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expectValidResponse(response, 401);
      expect(response.body.error.message).toContain('Invalid email or password');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expectValidResponse(response, 500);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let testUser: any;
    let refreshToken: string;

    beforeEach(async () => {
      testUser = await createTestUser();
      
      // Login to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expectValidResponse(response, 500);
    });

    it('should fail with missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expectValidResponse(response, 500);
    });
  });

  describe('POST /api/auth/logout', () => {
    let testUser: any;
    let refreshToken: string;

    beforeEach(async () => {
      testUser = await createTestUser();
      
      // Login to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });

      expectValidResponse(response, 200);
      expect(response.body.message).toContain('Logout successful');
    });

    it('should fail without refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({});

      expectValidResponse(response, 200);
    });
  });

  describe('POST /api/auth/logout-all', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it('should logout from all devices successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout-all')
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.message).toContain('All sessions logged out successfully');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout-all');

      expectValidResponse(response, 401);
    });
  });

  describe('GET /api/auth/profile', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data.profile).toHaveProperty('id');
      expect(response.body.data.profile).toHaveProperty('email');
      expect(response.body.data.profile).toHaveProperty('name');
      expect(response.body.data.profile).not.toHaveProperty('password');
      expect(response.body.data.profile.email).toBe(testUser.email);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expectValidResponse(response, 401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set({ Authorization: 'Bearer invalid-token' });

      expectValidResponse(response, 401);
    });
  });

  describe('GET /api/auth/statistics', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await createTestUser();
    });

    it('should get user statistics successfully', async () => {
      const response = await request(app)
        .get('/api/auth/statistics')
        .set(getAuthHeader(testUser.token));

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('statistics');
      expect(response.body.data.statistics).toHaveProperty('totalRecipes');
      expect(response.body.data.statistics).toHaveProperty('totalComments');
      expect(response.body.data.statistics).toHaveProperty('totalLikes');
      expect(response.body.data.statistics).toHaveProperty('totalFollowers');
      expect(response.body.data.statistics).toHaveProperty('totalFollowing');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/statistics');

      expectValidResponse(response, 401);
    });
  });
});