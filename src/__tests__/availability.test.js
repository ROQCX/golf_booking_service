import express from 'express';
import request from 'supertest';
import { availabilityRouter } from '../routes/availability.js';
import { authenticateApiKey } from '../middleware/auth.js';
import { clearTestData, makeAuthenticatedRequest, testData } from './helpers.js';

const app = express();
app.use(express.json());
app.use(authenticateApiKey);
app.use('/availability', availabilityRouter);

describe('Availability API', () => {
  beforeEach(() => {
    clearTestData();
  });

  describe('GET /availability', () => {
    it('should return availability data for a valid request', async () => {
      const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
        club_id: testData.validBookings.majlis.club_id,
        date: testData.validBookings.majlis.date
      });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('availableTimes');
      expect(response.body).toHaveProperty('courseInfo');
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('clubId');
    });

    it('should return 400 for missing club_id', async () => {
      const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
        date: testData.validBookings.majlis.date
      });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing date', async () => {
      const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
        club_id: testData.validBookings.majlis.club_id
      });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent club', async () => {
      const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
        club_id: 'non-existent-club',
        date: testData.validBookings.majlis.date
      });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without API key', async () => {
      const response = await request(app)
        .get('/availability')
        .query({
          club_id: testData.validBookings.majlis.club_id,
          date: testData.validBookings.majlis.date
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return 403 with invalid API key', async () => {
      const response = await request(app)
        .get('/availability')
        .set('x-api-key', 'invalid-key')
        .query({
          club_id: testData.validBookings.majlis.club_id,
          date: testData.validBookings.majlis.date
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Forbidden');
    });
  });

  it('should return available tee times for Majlis course', async () => {
    const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
      club_id: testData.validBookings.majlis.club_id,
      date: testData.validBookings.majlis.date
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: testData.validBookings.majlis.date,
      clubId: testData.validBookings.majlis.club_id,
      courseInfo: {
        name: 'Majlis',
        difficulty: 'championship'
      }
    });
    expect(Array.isArray(response.body.availableTimes)).toBe(true);
    expect(response.body.availableTimes.length).toBeGreaterThan(0);
    
    // Check the structure of available times
    const timeSlot = response.body.availableTimes[0];
    expect(timeSlot).toHaveProperty('time');
    expect(timeSlot).toHaveProperty('maxPlayers');
    expect(timeSlot).toHaveProperty('price');
  });

  it('should return available tee times for Faldo course', async () => {
    const response = await makeAuthenticatedRequest(app, 'get', '/availability', {
      club_id: testData.validBookings.faldo.club_id,
      date: testData.validBookings.faldo.date
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: testData.validBookings.faldo.date,
      clubId: testData.validBookings.faldo.club_id,
      courseInfo: {
        name: 'Faldo',
        difficulty: 'resort'
      }
    });
    expect(Array.isArray(response.body.availableTimes)).toBe(true);
    expect(response.body.availableTimes.length).toBeGreaterThan(0);
  });
}); 