const request = require('supertest');
const app = require('../app');

jest.mock('../db');
const db = require('../db');


describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser_auth',
          password: 'testpass123'
        });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });
  
    it('should not allow duplicate usernames', async () => {
      await request(app).post('/api/auth/register').send({
        username: 'testuser_auth_dup',
        password: 'testpass123'
      });
  
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser_auth_dup',
        password: 'testpass123'
      });
  
      expect(res.statusCode).toBe(400);
    });
  });


describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/register').send({
        username: 'loginuser',
        password: 'loginpass'
      });
    });
  
    it('should return a token with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'loginpass'
        });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  
    it('should reject incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'loginuser',
          password: 'wrongpass'
        });
  
      expect(res.statusCode).toBe(401);
    });
  });


describe('GET /api/auth/me', () => {
    let token;
  
    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'meuser', password: 'mepass' });
  
      token = res.body.token;
    });
  
    it('should return the logged-in user’s data', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'meuser');
      expect(res.body).toHaveProperty('id');
    });
  
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  
    it('should return 401 for an invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
  
      expect(res.statusCode).toBe(401);
    });
  });