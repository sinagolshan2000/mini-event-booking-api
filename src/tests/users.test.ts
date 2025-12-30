import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app';
import { resetDB } from './setup';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;

let token_user_1: string = "08dc3f3bb44ba28822dfd0d111fa7e00769ad7f6d825ce5fdd591fa90f74bb83";
let token_user_2: string = "73f53f6d7f2b9d84fffa66c21b5efc848aa4cd616d8ba54772807e2906f8e3ea";
let admin_token: string = "0Xzzzf3bb44ba28822dfd0d111fa7e00769ad7f6d825ce5fdd591fa90f74bb83"

beforeEach(async () => {
  resetDB();
  app = buildApp();
  await app.ready();
});

afterEach(async () => {
  await app.close();
});

describe('User CRUD', () => {

  it('GET /users - should list users with pagination', async () => {


    const res = await request(app.server)
      .get('/users?page=1&limit=10')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('GET /users/:id - should return user by id', async () => {
    const email = 'testuser2@test.com';

    const list = await request(app.server)
      .get('/users')
      .set('Authorization', `Bearer ${token_user_1}`);

    const userId = list.body.items[0].id;

    const res = await request(app.server)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
  });

  it('GET /users/:id - should return 404 for missing user', async () => {

    const res = await request(app.server)
      .get('/users/99999')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('PUT /users - should update current user profile', async () => {

    const res = await request(app.server)
      .put('/users')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({
        description: 'Updated bio'
      });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Updated bio');
  });

  it('DELETE /users/delete-account - should delete own account', async () => {

    const res = await request(app.server)
      .delete('/users/delete-account/')
      .set('Authorization', `Bearer ${token_user_2}`);

    expect(res.status).toBe(204);

    // login should fail after deletion
    const login = await request(app.server)
      .post('/auth/login')
      .send({
        email: 'user5@test.com',
        password: 'password123'
      });

    expect(login.status).toBe(401);
  });

  it('DELETE /users/:id - should forbid non-admin user', async () => {

    const res = await request(app.server)
      .delete('/users/user2@example.com')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  it('DELETE /users/:id - should allow admin to delete user', async () => {
    const res = await request(app.server)
      .delete('/users/user2@example.com')
      .set('Authorization', `Bearer ${admin_token}`);

    expect(res.status).toBe(204);
  });

});
