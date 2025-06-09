const request = require('supertest');
const { client } = require('../server');
const app = require('../server');

beforeAll(async () => {
  // Clean up users and favorites collections before tests
  await client.db().collection('users').deleteMany({});
  await client.db().collection('favorites').deleteMany({});
});

afterAll(async () => {
  // Clean up after tests
  await client.db().collection('users').deleteMany({});
  await client.db().collection('favorites').deleteMany({});
  await client.close();
});

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
