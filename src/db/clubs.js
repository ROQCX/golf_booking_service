export const clubs = {
  "emirates-gc-majlis": {
    "id": "emirates-gc-majlis",
    "ezlinks_url": "https://api.ezlinks.fake/emirates/majlis",
    "api_key": "abc123",
    "name": "Emirates Golf Club - Majlis Course",
    "clubGroup": "emirates-gc",
    "courseInfo": {
      "name": "Majlis",
      "par": 72,
      "length": 7301,
      "difficulty": "championship"
    }
  },
  "emirates-gc-faldo": {
    "id": "emirates-gc-faldo",
    "ezlinks_url": "https://api.ezlinks.fake/emirates/faldo",
    "api_key": "abc123",
    "name": "Emirates Golf Club - Faldo Course",
    "clubGroup": "emirates-gc",
    "courseInfo": {
      "name": "Faldo",
      "par": 72,
      "length": 7052,
      "difficulty": "resort"
    }
  },
  "arabian-ranches": {
    "id": "arabian-ranches",
    "ezlinks_url": "https://api.ezlinks.fake/ranches",
    "api_key": "def456",
    "name": "Arabian Ranches Golf Club",
    "clubGroup": "arabian-ranches",
    "courseInfo": {
      "name": "Desert Course",
      "par": 72,
      "length": 7658,
      "difficulty": "desert"
    }
  }
};

export function getClubById(clubId) {
  const club = clubs[clubId];
  if (!club) {
    throw new Error(`Club not found: ${clubId}`);
  }
  return club;
}

export function getClubsByGroup(groupId) {
  return Object.values(clubs).filter(club => club.clubGroup === groupId);
} 