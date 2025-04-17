import { randomUUID } from 'crypto';

export class EZLinksError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export async function createBooking(club, { date, time, players, userPhone }) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate random booking failures
  if (Math.random() < 0.1) {
    throw new EZLinksError('Booking temporarily unavailable', 'BOOKING_ERROR');
  }

  const bookingId = randomUUID();
  
  return {
    bookingId,
    clubId: club.id,
    status: 'confirmed',
    date,
    time,
    players,
    userPhone,
    confirmation: `EZ${Math.floor(Math.random() * 1000000)}`,
    createdAt: new Date().toISOString()
  };
}

export async function getAvailability(club, date) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const availableTimes = [];
  const startHour = 7; // 7 AM
  const endHour = 17;  // 5 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      // Randomly make some slots unavailable
      if (Math.random() > 0.3) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        availableTimes.push({
          time: timeString,
          maxPlayers: 4,
          price: Math.floor(Math.random() * 50) + 150 // Random price between 150-200
        });
      }
    }
  }

  return {
    date,
    clubId: club.id,
    availableTimes
  };
}

export async function cancelBooking(club, bookingId) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simulate random cancellation failures
  if (Math.random() < 0.1) {
    throw new EZLinksError('Cancellation temporarily unavailable', 'CANCEL_ERROR');
  }

  return {
    bookingId,
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  };
} 