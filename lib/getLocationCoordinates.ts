import { GeoapifyResponse } from '@/types/geoapify'

type Address = {
  street?: string | null
  zip_code?: string | null
  city: string
  country_iso2: string
}

export async function getLocationCoordinates(location: { name: string } & Address) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

  const searchParams = new URLSearchParams({
    apiKey,
    name: location.name,
    ...(location.street && { street: location.street }),
    ...(location.zip_code && { postcode: location.zip_code }),
    city: location.city,
    countrycodes: location.country_iso2.toLowerCase(),
  })

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?${searchParams.toString()}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch location coordinates', { cause: response })
  }

  const data: GeoapifyResponse = await response.json()
  const coordinates = data.features[0]?.geometry.coordinates

  if (!coordinates) {
    throw new Error('No coordinates found for this location')
  }

  return {
    latitude: coordinates[1],
    longitude: coordinates[0],
  }
}
