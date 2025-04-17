# Golf Booking Service

A Node.js Express service that allows multiple golf clubs to accept tee time bookings through a mock EZLinks integration.

## Features

- 📅 Book tee times for multiple golf clubs
- 📆 Check tee time availability
- ❌ Cancel existing bookings
- 🏢 Multi-club support with individual EZLinks configurations
- 📝 In-memory booking storage (ready for database integration)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Book a Tee Time
```http
POST /book
Content-Type: application/json

{
  "club_id": "emirates-gc",
  "user_phone": "+971501234567",
  "date": "2024-03-20",
  "time": "07:30",
  "players": 2
}
```

### Check Availability
```http
GET /availability?club_id=emirates-gc&date=2024-03-20
```

### Cancel Booking
```http
POST /cancel
Content-Type: application/json

{
  "booking_id": "uuid-of-booking"
}
```

## Development

- Run in development mode (with auto-reload):
  ```bash
  npm run dev
  ```
- Run in production mode:
  ```bash
  npm start
  ```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging verbosity

## Mock Data

The service includes mock data for two golf clubs:
- Emirates Golf Club
- Arabian Ranches Golf Club

Each club has its own mock EZLinks configuration for testing. 