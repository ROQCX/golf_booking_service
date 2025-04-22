import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authenticateApiKey } from './middleware/auth.js';

import { bookingRouter } from './routes/booking.js';
import { availabilityRouter } from './routes/availability.js';
import { cancelRouter } from './routes/cancel.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
app.use(morgan('dev'));

// Apply authentication middleware to all routes except health check
app.use((req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  authenticateApiKey(req, res, next);
});

// Routes with proper prefixes
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/availability', availabilityRouter);
app.use('/api/v1/bookings/cancel', cancelRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 