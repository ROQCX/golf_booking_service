import { saveBooking } from '../db/bookings.js';
import { config } from 'dotenv';
import supertest from 'supertest';

// Load environment variables
config();

export function createTestBooking(clubId = 'emirates-gc-majlis', date = '2024-03-20', time = '07:30') {
  const booking = {
    bookingId: 'test-booking-id',
    clubId,
    status: 'confirmed',
    date,
    time,
    players: 2,
    userPhone: '+971501234567',
    confirmation: 'EZ123456',
    createdAt: new Date().toISOString(),
    courseInfo: {
      name: clubId === 'emirates-gc-majlis' ? 'Majlis' : 'Faldo',
      startingHole: 1
    }
  };

  saveBooking(booking);
  return booking;
}

export function clearTestData() {
  // In a real implementation, this would clear the test database
  // For our in-memory store, we can just clear the bookings Map
  const bookings = new Map();
  return bookings;
}

export const testData = {
  validBookings: {
    majlis: {
      club_id: 'emirates-gc-majlis',
      user_phone: '+971501234567',
      date: '2024-03-20',
      time: '07:30',
      players: 2
    },
    faldo: {
      club_id: 'emirates-gc-faldo',
      user_phone: '+971501234568',
      date: '2024-03-20',
      time: '08:00',
      players: 4
    }
  }
};

// Helper function to make authenticated requests
export function makeAuthenticatedRequest(app, method = 'get', path, data = {}) {
  if (!app || !path) {
    throw new Error('app and path are required parameters');
  }

  const request = supertest(app);
  let req;

  switch ((method || 'get').toLowerCase()) {
    case 'get':
      req = request.get(path);
      if (Object.keys(data).length > 0) {
        req = req.query(data);
      }
      break;
    case 'post':
      req = request.post(path);
      if (Object.keys(data).length > 0) {
        req = req.send(data);
      }
      break;
    case 'put':
      req = request.put(path);
      if (Object.keys(data).length > 0) {
        req = req.send(data);
      }
      break;
    case 'delete':
      req = request.delete(path);
      if (Object.keys(data).length > 0) {
        req = req.send(data);
      }
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  return req.set('Content-Type', 'application/json')
           .set('X-API-Key', process.env.API_KEY || 'test-api-key');
} 