import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app';
import { resetDB } from './setup';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;

beforeEach(async () => {
  resetDB();

  app = buildApp();
  await app.ready();

});

afterEach(async () => {
  await app.close();
});


describe('Users', () => {
  it('Should register and login user', async () => {
    const email = 'testuser@example.com';
    const password = 'password123';
    let res = await request(app.server)
      .post('/auth/register')
      .send({
        email: email,
        password: password,
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);

    res = await request(app.server)
      .post('/auth/login')
      .send({
        email: email,
        password: password,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

  });
  
});
