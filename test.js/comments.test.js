const request = require('supertest');
const app = require('../app');

jest.mock('../db');
const db = require('../db');


describe('GET /api/comments/me', () => {
    it('should retrieve all comments made by the logged-in user', async () => {
      const res = await request(app)
        .get('/api/comments/me')
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
  
      // Optional: check the structure of one comment
      if (res.body.length > 0) {
        const comment = res.body[0];
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('text');
        expect(comment).toHaveProperty('user_id');
        expect(comment.user_id).toBe(userId); // userId must match authenticated user
      }
    });
  
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/comments/me');
  
      expect(res.statusCode).toBe(401);
    });
  });


describe('POST /api/items/:itemId/reviews/:reviewId/comments', () => {
    it('should create a new comment on a review', async () => {
      const res = await request(app)
        .post(`/api/items/${itemId}/reviews/${reviewId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: 'This is a test comment.'
        });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('text', 'This is a test comment.');
      expect(res.body).toHaveProperty('id');
      commentId = res.body.id;
    });
  
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post(`/api/items/${itemId}/reviews/${reviewId}/comments`)
        .send({ text: 'unauth comment' });
  
      expect(res.statusCode).toBe(401);
    });
  });

describe('PUT /api/users/:userId/comments/:commentId', () => {
    it('should update a comment', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 'Updated comment text' });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('text', 'Updated comment text');
    });
  
    it('should return 403 if a different user tries to edit', async () => {
      const res = await request(app)
        .put(`/api/users/999/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 'Hack attempt' });
  
      expect(res.statusCode).toBe(403);
    });
  });


describe('DELETE /api/users/:userId/comments/:commentId 🔒', () => {
    it('should delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(204);
    });
  
    it('should return 404 if trying to delete a non-existent comment', async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}/comments/9999`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(404);
    });
  });