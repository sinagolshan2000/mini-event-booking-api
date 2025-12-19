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

describe('Bookings', () => {
  it('should create a booking successfully', async () => {
    const res = await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({ eventId: 'event-1' });

    expect(res.status).toBe(201);
    expect(res.body.eventId).toBe('event-1');
  });

  it('should prevent double booking', async () => {
    await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_2}`)
      .send({ eventId: 'event-1' });

    const res = await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_2}`)
      .send({ eventId: 'event-1' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('User already booked this event');
  });

  it('should respect event capacity', async () => {
    // Assuming capacity is 1
    const res1 = await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({ eventId: 'event-1' });

    const res2 = await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_2}`)
      .send({ eventId: 'event-1' });

    expect(res2.status).toBe(400);
    expect(res2.body.message).toBe('Event is fully booked');
  });


  it('should list all bookings for a user', async () => {
    // Create some bookings
    await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({ eventId: 'event-1' });

    await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({ eventId: 'event-2' });

    const res = await request(app.server)
      .get('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
  });

  it('should cancel a booking', async () => {
    const createRes = await request(app.server)
      .post('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`)
      .send({ eventId: 'event-2' });

    const bookingId = createRes.body.id;

    const res = await request(app.server)
      .delete(`/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(res.status).toBe(204);

    // Confirm it is gone
    const listRes = await request(app.server)
      .get('/bookings')
      .set('Authorization', `Bearer ${token_user_1}`);

    expect(listRes.body.data.find((b: any) => b.id === bookingId)).toBeUndefined();
  });
});
