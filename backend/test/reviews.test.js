const request = require('supertest');
const { client } = require('../server');
const app = require('../server');

beforeAll(async () => {
  // Clean up users and reviews collections before tests
  await client.db().collection('users').deleteMany({});
  await client.db().collection('reviews').deleteMany({});
});

afterAll(async () => {
  // Clean up after tests
  await client.db().collection('users').deleteMany({});
  await client.db().collection('reviews').deleteMany({});
  await client.close();
});

describe('Reviews API', () => {
  let token;
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ username: 'reviewuser', password: 'reviewpass' });
    const res = await request(app).post('/api/auth/login').send({ username: 'reviewuser', password: 'reviewpass' });
    token = res.body.token;
  });

  it('should add a review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: '456', rating: 8, comment: 'Great!' });
    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(8);
  });

  it('should get user reviews', async () => {
    const res = await request(app)
      .get('/api/reviews/user/reviewuser')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
