import express from 'express';
import request from 'supertest';
import bookRouter from '../routes/book.js';
import { clearTestData, testData } from './helpers.js';

describe('Booking API', () => {
  let app;
  let originalMathRandom;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(bookRouter);
    clearTestData();
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    clearTestData();
    Math.random = originalMathRandom;
  });

  it('should create a new booking for Majlis course', async () => {
    // Ensure booking succeeds
    Math.random = () => 0.5;

    const response = await request(app)
      .post('/book')
      .send(testData.validBookings.majlis);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'confirmed',
      clubId: testData.validBookings.majlis.club_id,
      date: testData.validBookings.majlis.date,
      time: testData.validBookings.majlis.time,
      players: testData.validBookings.majlis.players,
      userPhone: testData.validBookings.majlis.user_phone
    });
    expect(response.body.bookingId).toBeDefined();
    expect(response.body.confirmation).toBeDefined();
  });

  it('should create a new booking for Faldo course', async () => {
    // Ensure booking succeeds
    Math.random = () => 0.5;

    const response = await request(app)
      .post('/book')
      .send(testData.validBookings.faldo);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'confirmed',
      clubId: testData.validBookings.faldo.club_id,
      date: testData.validBookings.faldo.date,
      time: testData.validBookings.faldo.time,
      players: testData.validBookings.faldo.players,
      userPhone: testData.validBookings.faldo.user_phone
    });
    expect(response.body.bookingId).toBeDefined();
    expect(response.body.confirmation).toBeDefined();
  });

  it('should return 400 for missing required fields', async () => {
    const response = await request(app)
      .post('/book')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 400 for invalid players count', async () => {
    const response = await request(app)
      .post('/book')
      .send({
        ...testData.validBookings.majlis,
        players: 5
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid players count');
  });

  it('should return 404 for non-existent club', async () => {
    const response = await request(app)
      .post('/book')
      .send({
        ...testData.validBookings.majlis,
        club_id: 'non-existent-club'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Club not found: non-existent-club');
  });
}); 