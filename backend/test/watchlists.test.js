const request = require('supertest');
const app = require('../server');

describe('Watchlists API', () => {
  let token;
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ username: 'watchuser', password: 'watchpass' });
    const res = await request(app).post('/api/auth/login').send({ username: 'watchuser', password: 'watchpass' });
    token = res.body.token;
  });

  it('should create a watchlist', async () => {
    const res = await request(app)
      .post('/api/watchlists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Watchlist' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('My Watchlist');
  });

  it('should get watchlists', async () => {
    const res = await request(app)
      .get('/api/watchlists')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
