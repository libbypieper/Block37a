const request = require('supertest');
const app = require('../app');

jest.mock('../db');
const db = require('../db');


describe('GET /api/items/:itemId/reviews/:reviewId', () => {
    it('should return a specific review for an item', async () => {
      const res = await request(app).get(`/api/items/${itemId}/reviews/${reviewId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', reviewId);
    });

    it('should return 404 for non-existing review', async () => {
      const res = await request(app).get(`/api/items/${itemId}/reviews/999999`);
      expect(res.statusCode).toBe(404);
    });
  });


describe('POST /api/items/:itemId/reviews', () => {
    it('should allow an authenticated user to post a review', async () => {
      const res = await request(app)
        .post(`/api/items/${itemId}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, text: 'Great spot!' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.rating).toBe(4);
    });

    it('should not allow unauthenticated users to post a review', async () => {
      const res = await request(app)
        .post(`/api/items/${itemId}/reviews`)
        .send({ rating: 4, text: 'Great spot!' });

      expect(res.statusCode).toBe(401);
    });
  });


describe('GET /api/reviews/me', () => {
    it('should return all reviews by the authenticated user', async () => {
      const res = await request(app)
        .get('/api/reviews/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/reviews/me');
      expect(res.statusCode).toBe(401);
    });
  });



describe('PUT /api/users/:userId/reviews/:reviewId', () => {
    it('should allow a user to update their review', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5, text: 'Updated review text' });

      expect(res.statusCode).toBe(200);
      expect(res.body.rating).toBe(5);
      expect(res.body.text).toBe('Updated review text');
    });
  });


describe('DELETE /api/users/:userId/reviews/:reviewId 🔒', () => {
    it('should allow a user to delete their review', async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}/reviews/${reviewId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });
  });