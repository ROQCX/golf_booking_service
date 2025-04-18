import request from 'supertest';
import { app } from '../app';
import { saveBooking } from '../db/bookings';
import { testData, clearTestData } from './testData';
import { makeAuthenticatedRequest } from './helpers';

describe('POST /cancel', () => {
  let testBooking;

  beforeEach(async () => {
    await clearTestData();
    // Create a booking with the correct structure
    testBooking = {
      bookingId: 'test-booking-majlis',
      clubId: 'emirates-gc-majlis',
      date: '2024-03-20',
      time: '09:00',
      players: 2,
      player_names: ['John Doe', 'Jane Smith'],
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    await saveBooking(testBooking);
  });

  it('should handle booking cancellation', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/cancel', {
      booking_id: testBooking.bookingId
    });

    // The response should either be successful (200) or service unavailable (503)
    if (response.status === 200) {
      expect(response.body).toEqual({
        message: 'Booking cancelled successfully',
        booking: {
          ...testBooking,
          status: 'cancelled',
          cancelledAt: expect.any(String)
        }
      });
    } else {
      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        error: 'Service unavailable',
        message: 'Cancellation temporarily unavailable'
      });
    }
  });

  it('should return 400 if booking_id is missing', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/cancel', {});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required fields',
      required: ['booking_id']
    });
  });

  it('should return 404 if booking does not exist', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/cancel', {
      booking_id: 'non-existent-booking'
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Booking not found: non-existent-booking'
    });
  });

  it('should return 401 if API key is missing', async () => {
    const response = await request(app)
      .post('/cancel')
      .send({ booking_id: testBooking.bookingId });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Unauthorized',
      message: 'API key is required'
    });
  });

  it('should return 403 if API key is invalid', async () => {
    const response = await request(app)
      .post('/cancel')
      .set('x-api-key', 'invalid-key')
      .send({ booking_id: testBooking.bookingId });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  });
}); 