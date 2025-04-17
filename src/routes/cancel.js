import express from 'express';
import { getClubById } from '../db/clubs.js';
import { cancelBooking } from '../services/ezlinksClient.js';
import { getBooking, updateBooking } from '../db/bookings.js';

const router = express.Router();

router.post('/cancel', async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['booking_id']
      });
    }

    // Get existing booking
    const booking = getBooking(booking_id);
    const club = getClubById(booking.clubId);
    
    // Cancel booking through EZLinks
    const cancelResult = await cancelBooking(club, booking_id);

    // Update booking status in our store
    const updatedBooking = updateBooking(booking_id, {
      status: 'cancelled',
      cancelledAt: cancelResult.cancelledAt
    });

    console.log(`Booking cancelled: ${booking_id} at ${club.name}`);

    res.json(updatedBooking);
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(error.code === 'CANCEL_ERROR' ? 503 : 500).json({
      error: error.message
    });
  }
});

export default router; 