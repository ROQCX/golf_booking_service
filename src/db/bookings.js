// In-memory bookings store
const bookings = new Map();

export function saveBooking(booking) {
  bookings.set(booking.bookingId, booking);
  return booking;
}

export function getBooking(bookingId) {
  const booking = bookings.get(bookingId);
  if (!booking) {
    throw new Error(`Booking not found: ${bookingId}`);
  }
  return booking;
}

export function updateBooking(bookingId, updates) {
  const booking = getBooking(bookingId);
  const updatedBooking = { ...booking, ...updates };
  bookings.set(bookingId, updatedBooking);
  return updatedBooking;
}

export function getBookingsByClub(clubId) {
  return Array.from(bookings.values())
    .filter(booking => booking.clubId === clubId);
}

export function deleteBooking(bookingId) {
  const booking = getBooking(bookingId);
  bookings.delete(bookingId);
  return booking;
} 