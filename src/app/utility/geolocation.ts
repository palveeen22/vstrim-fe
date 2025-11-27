/**
 * Geolocation Utility Functions
 * 
 * Analogi: Bayangkan ini seperti Google Maps yang menghitung:
 * - Jarak antara 2 titik (Haversine formula)
 * - Filter lokasi dalam radius tertentu
 * - Sort berdasarkan jarak terdekat
 */

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationWithDistance extends Coordinates {
  id: string;
  city?: string;
  district?: string;
  distance: number; // dalam kilometer
}

/**
 * Haversine Formula
 * Menghitung jarak antara dua koordinat di permukaan bumi
 * 
 * Analogi: Seperti mengukur jarak dua kota dengan memperhitungkan
 * kelengkungan bumi (bukan garis lurus di peta datar)
 * 
 * @param lat1 - Latitude titik 1
 * @param lon1 - Longitude titik 1
 * @param lat2 - Latitude titik 2
 * @param lon2 - Longitude titik 2
 * @returns Jarak dalam kilometer
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Radius bumi dalam kilometer
  const R = 6371;

  // Konversi derajat ke radian
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Jarak dalam kilometer
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Konversi derajat ke radian
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter lokasi berdasarkan radius
 * 
 * Analogi: Seperti mencari restoran dalam radius 5km dari lokasi Anda
 * 
 * @param userLocation - Koordinat user (pusat lingkaran)
 * @param locations - Array lokasi yang akan difilter
 * @param radiusInKm - Radius dalam kilometer (default 30km)
 * @returns Array lokasi yang berada dalam radius + distance
 */
function filterByRadius<T extends Coordinates>(
  userLocation: Coordinates,
  locations: T[],
  radiusInKm: number = 30
): (T & { distance: number })[] {
  return locations
    .map((location) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      );

      return {
        ...location,
        distance,
      };
    })
    .filter((location) => location.distance <= radiusInKm)
    .sort((a, b) => a.distance - b.distance); // Sort by nearest first
}

/**
 * Check apakah lokasi dalam radius tertentu
 * 
 * @param userLocation - Koordinat user
 * @param targetLocation - Koordinat target
 * @param radiusInKm - Radius dalam kilometer
 * @returns true jika dalam radius
 */
function isWithinRadius(
  userLocation: Coordinates,
  targetLocation: Coordinates,
  radiusInKm: number = 30
): boolean {
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );

  return distance <= radiusInKm;
}

/**
 * Format jarak untuk display
 * 
 * @param distanceInKm - Jarak dalam kilometer
 * @returns Formatted string (e.g., "2.5 km", "500 m")
 */
function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    // Kurang dari 1km, tampilkan dalam meter
    const meters = Math.round(distanceInKm * 1000);
    return `${meters} m`;
  }

  // Lebih dari 1km
  return `${distanceInKm.toFixed(1)} km`;
}

/**
 * Get bounding box coordinates untuk optimization
 * Berguna untuk database query yang lebih efisien
 * 
 * Analogi: Daripada cek semua lokasi di dunia, kita buat kotak
 * (bounding box) dan hanya cek lokasi dalam kotak tersebut
 * 
 * @param center - Koordinat pusat
 * @param radiusInKm - Radius dalam kilometer
 * @returns Bounding box {minLat, maxLat, minLon, maxLon}
 */
function getBoundingBox(
  center: Coordinates,
  radiusInKm: number
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  // 1 degree latitude ≈ 111 km
  // 1 degree longitude varies by latitude
  const latDelta = radiusInKm / 111;
  const lonDelta = radiusInKm / (111 * Math.cos(toRadians(center.latitude)));

  return {
    minLat: center.latitude - latDelta,
    maxLat: center.latitude + latDelta,
    minLon: center.longitude - lonDelta,
    maxLon: center.longitude + lonDelta,
  };
}

/**
 * Example usage with Prisma
 * Query optimization menggunakan bounding box
 */
function buildRadiusQuery(
  userLocation: Coordinates,
  radiusInKm: number = 30
) {
  const bbox = getBoundingBox(userLocation, radiusInKm);

  return {
    latitude: {
      gte: bbox.minLat,
      lte: bbox.maxLat,
    },
    longitude: {
      gte: bbox.minLon,
      lte: bbox.maxLon,
    },
  };
}

/**
 * Get nearest location from array
 * 
 * @param userLocation - Koordinat user
 * @param locations - Array lokasi
 * @returns Lokasi terdekat dengan distance
 */
function getNearestLocation<T extends Coordinates>(
  userLocation: Coordinates,
  locations: T[]
): (T & { distance: number }) | null {
  if (locations.length === 0) return null;

  let nearest = locations[0];
  let minDistance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    nearest.latitude,
    nearest.longitude
  );

  for (let i = 1; i < locations.length; i++) {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      locations[i].latitude,
      locations[i].longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = locations[i];
    }
  }

  return {
    ...nearest,
    distance: minDistance,
  };
}

/**
 * Group locations by distance ranges
 * 
 * @param userLocation - Koordinat user
 * @param locations - Array lokasi
 * @returns Grouped locations by distance
 */
function groupByDistanceRange<T extends Coordinates>(
  userLocation: Coordinates,
  locations: T[]
): {
  nearby: (T & { distance: number })[]; // 0-5km
  moderate: (T & { distance: number })[]; // 5-15km
  far: (T & { distance: number })[]; // 15-30km
  veryFar: (T & { distance: number })[]; // >30km
} {
  const locationsWithDistance = locations.map((location) => ({
    ...location,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude
    ),
  }));

  return {
    nearby: locationsWithDistance.filter((l) => l.distance <= 5),
    moderate: locationsWithDistance.filter((l) => l.distance > 5 && l.distance <= 15),
    far: locationsWithDistance.filter((l) => l.distance > 15 && l.distance <= 30),
    veryFar: locationsWithDistance.filter((l) => l.distance > 30),
  };
}

export {
  type LocationWithDistance,
  calculateDistance,
  toRadians,
  filterByRadius,
  isWithinRadius,
  formatDistance,
  buildRadiusQuery,
  getNearestLocation,
  groupByDistanceRange
}