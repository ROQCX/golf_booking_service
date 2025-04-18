import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Middleware to authenticate requests using API key
 */
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required'
    });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key'
    });
  }

  next();
} 