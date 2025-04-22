# Golf Booking Service API Documentation

## Base URL
```
https://golfbookingservice-production.up.railway.app/api/v1
```

## Authentication
All requests must include an `x-api-key` header with a valid API key.

```http
x-api-key: your-api-key-here
```

## Endpoints

### 1. Check Availability
Get available tee times for a specific club and date.

```http
GET /availability?club_id={club_id}&date={date}
```

#### Query Parameters
- `club_id` (required): The ID of the golf club
- `date` (required): Date in YYYY-MM-DD format

#### Example Request
```bash
curl -X GET "https://golfbookingservice-production.up.railway.app/api/v1/availability?club_id=emirates-gc-majlis&date=2024-04-22" \
  -H "x-api-key: your-api-key-here"
```

#### Example Response
```json
{
  "availableTimes": [
    {
      "time": "07:00",
      "price": 75.00,
      "availableSpots": 4
    },
    {
      "time": "07:10",
      "price": 75.00,
      "availableSpots": 2
    }
  ],
  "courseInfo": {
    "name": "Majlis",
    "par": 72,
    "length": 7301,
    "difficulty": "championship"
  }
}
```

### 2. Bookings

#### Create Booking
Create a new golf booking.

```http
POST /bookings
```

##### Request Body
```json
{
  "club_id": "emirates-gc-majlis",
  "date": "2024-04-22",
  "time": "07:00",
  "players": 2,
  "player_names": ["John Doe", "Jane Smith"]
}
```

##### Parameters
- `club_id` (required): The ID of the golf club
- `date` (required): Date in YYYY-MM-DD format
- `time` (required): Time in HH:MM format
- `players` (required): Number of players (1-4)
- `player_names` (required): Array of player names

##### Example Request
```bash
curl -X POST "https://golfbookingservice-production.up.railway.app/api/v1/bookings" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{
    "club_id": "emirates-gc-majlis",
    "date": "2024-04-22",
    "time": "07:00",
    "players": 2,
    "player_names": ["John Doe", "Jane Smith"]
  }'
```

##### Example Response
```json
{
  "booking_id": "BOOK123456",
  "courseInfo": {
    "name": "Majlis",
    "par": 72,
    "length": 7301,
    "difficulty": "championship"
  },
  "date": "2024-04-22",
  "time": "07:00",
  "players": 2,
  "player_names": ["John Doe", "Jane Smith"],
  "status": "confirmed",
  "confirmation": "EZ374307",
  "createdAt": "2024-04-21T15:30:00Z"
}
```

#### Get Booking
Retrieve details of a specific booking.

```http
GET /bookings/{booking_id}
```

##### Example Request
```bash
curl -X GET "https://golfbookingservice-production.up.railway.app/api/v1/bookings/BOOK123456" \
  -H "x-api-key: your-api-key-here"
```

##### Example Response
```json
{
  "booking_id": "BOOK123456",
  "courseInfo": {
    "name": "Majlis",
    "par": 72,
    "length": 7301,
    "difficulty": "championship"
  },
  "date": "2024-04-22",
  "time": "07:00",
  "players": 2,
  "player_names": ["John Doe", "Jane Smith"],
  "status": "confirmed",
  "confirmation": "EZ374307",
  "createdAt": "2024-04-21T15:30:00Z"
}
```

#### Update Booking
Update an existing booking.

```http
PATCH /bookings/{booking_id}
```

##### Request Body
```json
{
  "players": 3,
  "player_names": ["John Doe", "Jane Smith", "Bob Johnson"]
}
```

##### Parameters
- `players` (optional): Updated number of players (1-4)
- `player_names` (optional): Updated array of player names

##### Example Request
```bash
curl -X PATCH "https://golfbookingservice-production.up.railway.app/api/v1/bookings/BOOK123456" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{
    "players": 3,
    "player_names": ["John Doe", "Jane Smith", "Bob Johnson"]
  }'
```

##### Example Response
```json
{
  "booking_id": "BOOK123456",
  "courseInfo": {
    "name": "Majlis",
    "par": 72,
    "length": 7301,
    "difficulty": "championship"
  },
  "date": "2024-04-22",
  "time": "07:00",
  "players": 3,
  "player_names": ["John Doe", "Jane Smith", "Bob Johnson"],
  "status": "confirmed",
  "confirmation": "EZ374307",
  "createdAt": "2024-04-21T15:30:00Z"
}
```

### 3. Cancel Booking
Cancel an existing booking.

```http
POST /bookings/cancel
```

#### Request Body
```json
{
  "booking_id": "BOOK123456"
}
```

#### Parameters
- `booking_id` (required): The ID of the booking to cancel

#### Example Request
```bash
curl -X POST "https://golfbookingservice-production.up.railway.app/api/v1/bookings/cancel" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{
    "booking_id": "BOOK123456"
  }'
```

#### Example Response
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "booking_id": "BOOK123456",
    "status": "cancelled",
    "cancelledAt": "2024-04-21T15:30:00Z"
  }
}
```

### 4. Health Check
Check if the service is running.

```http
GET /health
```

#### Example Request
```bash
curl -X GET "https://golfbookingservice-production.up.railway.app/health"
```

#### Example Response
```json
{
  "status": "healthy"
}
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Missing or invalid parameters
- `401 Unauthorized`: Missing or invalid API key
- `403 Forbidden`: Invalid API key
- `404 Not Found`: Club or booking not found
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: External service (EZLinks) unavailable

Example error response:
```json
{
  "error": "Error message",
  "message": "Detailed error message (in development only)"
}
``` 