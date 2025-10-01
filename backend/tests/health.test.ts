import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../src/server';
import { expectValidResponse } from './helpers/testUtils';

describe('Health Check Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status successfully', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data.status).toBe('healthy');
      expect(response.body.data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include service information', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data.status).toBe('healthy');
    });

    it('should respond quickly', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/health');

      const responseTime = Date.now() - startTime;
      
      expectValidResponse(response, 200);
      expect(response.body.data.status).toBe('healthy');
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expectValidResponse(response, 200);
        expect(response.body.data.status).toBe('healthy');
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data.status).toBe('healthy');
    });

    it('should include environment information', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('environment');
      expect(['development', 'test', 'production']).toContain(response.body.data.environment);
    });

    it('should include version information', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('version');
      expect(typeof response.body.data.version).toBe('string');
      expect(response.body.data.version).toBe('1.0.0');
    });

    it('should include uptime information', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('version');
      expect(typeof response.body.data.uptime).toBe('number');
      expect(response.body.data.uptime).toBeGreaterThan(0);
      expect(response.body.data.environment).toBe('test');
      expect(response.body.data.version).toBe('1.0.0');
    });

    it('should include environment information', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
        expect(response.body.data).toHaveProperty('environment');
        expect(['development', 'test', 'production']).toContain(response.body.data.environment);
    });
  });





  describe('Health endpoint error handling', () => {
    it('should handle invalid health endpoints gracefully', async () => {
      const response = await request(app)
        .get('/api/health/invalid');

      expect(response.status).toBe(404);
    });

    it('should return consistent response format', async () => {
      const response = await request(app).get('/api/health');
      
      expectValidResponse(response, 200);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should include CORS headers for health endpoints', async () => {
      const response = await request(app)
        .get('/api/health');

      expectValidResponse(response, 200);
      // Check if CORS headers are present (if CORS is configured)
      if (response.headers['access-control-allow-origin']) {
        expect(response.headers['access-control-allow-origin']).toBeDefined();
      }
    });
  });

  describe('Health metrics and monitoring', () => {
    it('should provide consistent timestamps', async () => {
      const response1 = await request(app).get('/api/health');
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
      const response2 = await request(app).get('/api/health');

      expectValidResponse(response1, 200);
      expectValidResponse(response2, 200);
      
      const timestamp1 = new Date(response1.body.data.timestamp);
      const timestamp2 = new Date(response2.body.data.timestamp);
      
      expect(timestamp2.getTime()).toBeGreaterThan(timestamp1.getTime());
    });

    it('should handle high load of health checks', async () => {
      const concurrentRequests = 50;
      const requests = Array(concurrentRequests).fill(null).map(() => 
        request(app).get('/api/health')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      responses.forEach(response => {
        expectValidResponse(response, 200);
        expect(response.body.data.status).toBe('healthy');
      });

      // All requests should complete within reasonable time
      expect(totalTime).toBeLessThan(5000); // 5 seconds for 50 requests
    });

    it('should maintain health status consistency', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(requests);
      const statuses = responses.map(r => r.body.data.status);
      
      // All responses should have the same status
      expect(new Set(statuses).size).toBe(1);
      expect(statuses[0]).toBe('healthy');
    });
  });
});