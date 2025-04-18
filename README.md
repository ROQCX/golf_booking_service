# Golf Booking Service

A RESTful API service for managing golf course bookings, built with Node.js and Express.

## Features

- Book tee times at multiple golf courses
- Check course availability
- Cancel existing bookings
- Secure API key authentication

## API Endpoints

### Booking
- `POST /booking` - Create a new booking
  - Required fields: `club_id`, `date`, `time`, `players`, `player_names`
  - Returns: Booking details with course information

### Availability
- `GET /availability` - Check course availability
  - Required query params: `club_id`, `date`
  - Returns: Available tee times with pricing

### Cancel
- `POST /cancel` - Cancel an existing booking
  - Required fields: `booking_id`
  - Returns: Cancellation confirmation

## Authentication

All endpoints require an API key in the `x-api-key` header.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Testing

The project includes comprehensive test coverage for all endpoints:
- Booking creation and validation
- Availability checking
- Cancellation handling
- Error cases and authentication

Run tests with:
```bash
npm test
```

## License

MIT 