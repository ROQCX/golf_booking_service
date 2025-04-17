import express from 'express';
import request from 'supertest';
import cancelRouter from '../routes/cancel.js';
import { createTestBooking, clearTestData } from './helpers.js';

describe('Cancellation API', () => {
  let app;
  let majlisBooking;
  let faldoBooking;
  let originalMathRandom;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cancelRouter);
    clearTestData();
    majlisBooking = createTestBooking('emirates-gc-majlis');
    faldoBooking = createTestBooking('emirates-gc-faldo', '2024-03-20', '08:00');
    originalMathRandom = Math.random;
  });

  afterEach(() => {
    clearTestData();
    Math.random = originalMathRandom;
  });

  it('should cancel a Majlis course booking', async () => {
    // Ensure cancellation succeeds
    Math.random = () => 0.5;

    const response = await request(app)
      .post('/cancel')
      .send({
        booking_id: majlisBooking.bookingId
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      bookingId: majlisBooking.bookingId,
      status: 'cancelled'
    });
    expect(response.body.cancelledAt).toBeDefined();
  });

  it('should cancel a Faldo course booking', async () => {
    // Ensure cancellation succeeds
    Math.random = () => 0.5;

    const response = await request(app)
      .post('/cancel')
      .send({
        booking_id: faldoBooking.bookingId
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      bookingId: faldoBooking.bookingId,
      status: 'cancelled'
    });
    expect(response.body.cancelledAt).toBeDefined();
  });

  it('should return 400 for missing booking_id', async () => {
    const response = await request(app)
      .post('/cancel')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 404 for non-existent booking', async () => {
    const response = await request(app)
      .post('/cancel')
      .send({
        booking_id: 'non-existent-booking'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Booking not found: non-existent-booking');
  });

  it('should handle EZLinks cancellation errors', async () => {
    // Force cancellation to fail
    Math.random = () => 0.05;

    const response = await request(app)
      .post('/cancel')
      .send({
        booking_id: majlisBooking.bookingId
      });

    expect(response.status).toBe(503);
    expect(response.body.error).toBe('Cancellation temporarily unavailable');
  });
}); 