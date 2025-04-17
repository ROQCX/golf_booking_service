import { saveBooking } from '../db/bookings.js';

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
      user_phone: '+971501234567',
      date: '2024-03-20',
      time: '08:00',
      players: 3
    }
  }
}; 