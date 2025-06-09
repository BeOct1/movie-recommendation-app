const request = require('supertest');
const app = require('../server');

describe('Favorites API', () => {
  let token;
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ username: 'favuser', password: 'favpass' });
    const res = await request(app).post('/api/auth/login').send({ username: 'favuser', password: 'favpass' });
    token = res.body.token;
  });

  it('should add a favorite', async () => {
    const res = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: '123', title: 'Test Movie' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Movie');
  });

  it('should get favorites', async () => {
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
