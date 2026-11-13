export function parseCoordinates({
  latitude,
  longitude,
}: {
  latitude?: number | null
  longitude?: number | null
} & Record<string, unknown>) {
  if (
    latitude != null &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude != null &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  ) {
    return { latitude, longitude }
  }

  return null
}