import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://golfbookingservice-production.up.railway.app"
API_KEY = "hLKTfl+cy1c2RN8aT1UjxcK0YPhKCqPkjagaZoD8oRw="
CLUB_ID = "emirates-gc-majlis"

# Headers for all requests
headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
}

def test_endpoint(method, endpoint, params=None, data=None):
    """Generic function to test any endpoint"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\nTesting {method} {url}")
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        else:
            response = requests.post(url, headers=headers, json=data)
            
        print(f"Status Code: {response.status_code}")
        print("Response:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)
            
        return response.json() if response.status_code in [200, 201] else None
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None

def main():
    # Test health endpoint
    test_endpoint("GET", "/health")
    
    # Test availability
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    availability = test_endpoint(
        "GET",
        "/",
        params={"club_id": CLUB_ID, "date": tomorrow}
    )
    
    # If we got availability data, try to make a booking
    if availability and availability.get("availableTimes"):
        first_time = availability["availableTimes"][0]
        booking = test_endpoint(
            "POST",
            "/",
            data={
                "club_id": CLUB_ID,
                "date": tomorrow,
                "time": first_time["time"],
                "players": 2,
                "player_names": ["Test Player 1", "Test Player 2"]
            }
        )
        
        # If booking was successful, try to cancel it
        if booking and booking.get("booking_id"):
            test_endpoint(
                "POST",
                "/",
                data={"booking_id": booking["booking_id"]}
            )

if __name__ == "__main__":
    main() 