export const testData = {
  validBookings: {
    majlis: {
      booking_id: "test-booking-majlis",
      club_id: "emirates-gc-majlis",
      date: "2024-03-20",
      time: "09:00",
      players: 2,
      player_names: ["John Doe", "Jane Smith"]
    },
    faldo: {
      booking_id: "test-booking-faldo",
      club_id: "emirates-gc-faldo",
      date: "2024-03-20",
      time: "10:00",
      players: 3,
      player_names: ["Alice Johnson", "Bob Wilson", "Carol Brown"]
    }
  }
};

export async function clearTestData() {
  // Clear any test data from the database if needed
} 