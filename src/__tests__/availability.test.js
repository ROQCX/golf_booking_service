import express from 'express';
import request from 'supertest';
import availabilityRouter from '../routes/availability.js';
import { clearTestData, testData } from './helpers.js';

describe('Availability API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(availabilityRouter);
    clearTestData();
  });

  afterEach(() => {
    clearTestData();
  });

  it('should return available tee times for Majlis course', async () => {
    const response = await request(app)
      .get('/availability')
      .query({
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
    const response = await request(app)
      .get('/availability')
      .query({
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

  it('should return 400 for missing required fields', async () => {
    const response = await request(app)
      .get('/availability')
      .query({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should return 404 for non-existent club', async () => {
    const response = await request(app)
      .get('/availability')
      .query({
        club_id: 'non-existent-club',
        date: testData.validBookings.majlis.date
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Club not found: non-existent-club');
  });
}); 