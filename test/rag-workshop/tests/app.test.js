const request = require('supertest');
const app = require('../src/index');

describe('RAG Application API', () => {
  it('should return OK for health check', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('OK');
  });

  it('should return search results for a valid query', async () => {
    const res = await request(app).get('/api/search?query=What%20is%20MongoDB%20Atlas?');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
  });

  it('should return a response for a valid RAG query', async () => {
    const res = await request(app)
      .post('/api/rag')
      .send({ query: 'What are the security features of MongoDB Atlas?' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });
});
