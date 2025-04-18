import express from 'express';
import { bookingRouter } from './routes/booking.js';
import { cancelRouter } from './routes/cancel.js';
import { availabilityRouter } from './routes/availability.js';
import { authenticateApiKey } from './middleware/auth.js';

const app = express();

// Middleware
app.use(express.json());
app.use(authenticateApiKey);

// Routes
app.use('/booking', bookingRouter);
app.use('/cancel', cancelRouter);
app.use('/availability', availabilityRouter);

export { app }; 