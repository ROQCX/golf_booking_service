import express from 'express';
import request from 'supertest';
import { bookingRouter } from '../routes/booking.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { clearTestData, makeAuthenticatedRequest, testData } from './helpers.js';

const app = express();
app.use(express.json());
app.use(authenticateApiKey);
app.use('/booking', bookingRouter);

describe('Booking API', () => {
  beforeEach(() => {
    clearTestData();
  });

  it('should create a booking for Majlis course', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/booking', {
      ...testData.validBookings.majlis,
      player_names: ['John Doe', 'Jane Smith']
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('booking_id');
    expect(response.body).toHaveProperty('courseInfo');
    expect(response.body.courseInfo).toMatchObject({
      name: 'Majlis',
      difficulty: 'championship'
    });
  });

  it('should create a booking for Faldo course', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/booking', {
      ...testData.validBookings.faldo,
      player_names: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown']
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('booking_id');
    expect(response.body).toHaveProperty('courseInfo');
    expect(response.body.courseInfo).toMatchObject({
      name: 'Faldo',
      difficulty: 'resort'
    });
  });

  it('should return 400 for missing required fields', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/booking', {});
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid players count', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/booking', {
      ...testData.validBookings.majlis,
      players: 5,
      player_names: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Extra Person']
    });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for non-existent club', async () => {
    const response = await makeAuthenticatedRequest(app, 'post', '/booking', {
      ...testData.validBookings.majlis,
      club_id: 'non-existent-club',
      player_names: ['John Doe', 'Jane Smith']
    });
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 without API key', async () => {
    const response = await request(app)
      .post('/booking')
      .send(testData.validBookings.majlis);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should return 403 with invalid API key', async () => {
    const response = await request(app)
      .post('/booking')
      .set('x-api-key', 'invalid-key')
      .send(testData.validBookings.majlis);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Forbidden');
  });
}); 