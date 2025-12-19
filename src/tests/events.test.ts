import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../app';
import { resetDB } from './setup';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let token_user_1: string = "08dc3f3bb44ba28822dfd0d111fa7e00769ad7f6d825ce5fdd591fa90f74bb83";
let token_user_2: string = "73f53f6d7f2b9d84fffa66c21b5efc848aa4cd616d8ba54772807e2906f8e3ea";

beforeEach(async () => {
  resetDB();

  app = buildApp();
  await app.ready();

});

afterEach(async () => {
  await app.close();
});


describe('Events', () => {
  it('should list events with remaining seats', async () => {
    const res = await request(app.server)
      .get('/events')
      .set('Authorization', `Bearer ${token_user_1}`);

    console.log('STATUS:', res.status);
    console.log('BODY:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data[0].remainingSeats).toBeDefined();
  });

  it('should filter events by start and end date', async () => {
    const res = await request(app.server)
  .get('/events?startDate=2025-12-01T00:00:00Z&endDate=2025-12-31T23:59:59Z')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((e: any) => e.date >= '2025-12-01' && e.date <= '2025-12-31')).toBe(true);
  });

  it('should filter events by location', async () => {
    const res = await request(app.server)
      .get('/events?location=Test Hall')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((e: any) => e.location.toLowerCase().includes('test hall'.toLowerCase()))).toBe(true);
  });

  it('should support pagination', async () => {
    const res = await request(app.server)
      .get('/events?page=1&limit=1')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
  });

  it('should fetch a single event by ID', async () => {
  const res = await request(app.server)
    .get('/events/event-1')
    .set('Authorization', `Bearer ${token_user_1}`);

  expect(res.status).toBe(200);
  expect(res.body.id).toBe('event-1');
  });

  it('should create an event', async () => {
  const res = await request(app.server)
    .post('/events')
    .set('Authorization', `Bearer ${token_user_1}`)
    .send({
      name: 'Tech Conference',
      date: '2025-12-30T10:00:00Z',
      location: 'Tehran',
      capacity: 100
    });
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  });

  it('should update an event', async () => {

    const res = await request(app.server)
      .put('/events/event-1')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({
        name: 'Updated Event',
        date: '2025-12-31T10:00:00Z',
        location: 'Singapore',
        capacity: 153
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Event');
    expect(res.body.capacity).toBe(153);
  });

  it('should delete an event', async () => {

    const res = await request(app.server)
      .delete('/events/event-2')
      .set('Authorization', `Bearer ${token_user_1}`);
    expect(res.status).toBe(204);
  });
});


