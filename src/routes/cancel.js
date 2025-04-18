import express from 'express';
import { getClubById } from '../db/clubs.js';
import { cancelBooking } from '../services/ezlinksClient.js';
import { getBooking, updateBooking } from '../db/bookings.js';

export const cancelRouter = express.Router();

cancelRouter.post('/', async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['booking_id']
      });
    }

    // Get existing booking
    const booking = await getBooking(booking_id);
    if (!booking) {
      return res.status(404).json({
        error: `Booking not found: ${booking_id}`
      });
    }

    const club = await getClubById(booking.clubId);
    if (!club) {
      return res.status(404).json({
        error: `Club not found: ${booking.clubId}`
      });
    }
    
    // Cancel booking through EZLinks
    const cancelResult = await cancelBooking(club, booking_id);

    // Update booking status in our store
    const updatedBooking = await updateBooking(booking_id, {
      status: 'cancelled',
      cancelledAt: cancelResult.cancelledAt
    });

    console.log(`Booking cancelled: ${booking_id} at ${club.name}`);

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    if (error.message.includes('Booking not found')) {
      return res.status(404).json({
        error: error.message
      });
    }
    if (error.message.includes('Club not found')) {
      return res.status(404).json({
        error: error.message
      });
    }
    if (error.code === 'CANCEL_ERROR') {
      return res.status(503).json({
        error: error.message
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
}); 