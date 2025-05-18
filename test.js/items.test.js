const request = require('supertest');
const app = require('../app');

jest.mock('../db');
const db = require('../db');

describe('GET /api/items', () => {
    it('should return a list of all items', async () => {
      const res = await request(app).get('/api/items');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('description');
      expect(res.body[0]).toHaveProperty('rating');
    });
  });


describe('GET /api/items/:itemId', () => {
    it('should return the specific item with details', async () => {
      const res = await request(app).get('/api/items/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
      expect(res.body).toHaveProperty('rating');
    });
  
    it('should return 404 for non-existent item', async () => {
      const res = await request(app).get('/api/items/99999');
      expect(res.statusCode).toBe(404);
    });
  });


describe('GET /api/items/:itemId/reviews', () => {
    it('should return reviews for a given item', async () => {
      const res = await request(app).get('/api/items/1/reviews');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('user_id');
        expect(res.body[0]).toHaveProperty('text');
        expect(res.body[0]).toHaveProperty('rating');
      }
    });
  
    it('should return 404 if the item does not exist', async () => {
      const res = await request(app).get('/api/items/99999/reviews');
      expect(res.statusCode).toBe(404);
    });
  });