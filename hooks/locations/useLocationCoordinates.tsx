import { GeoapifyResponse } from '@/types/geoapify'
import { useQuery } from '@tanstack/react-query'

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

  return {
    latitude: data.features[0]?.geometry.coordinates[1],
    longitude: data.features[0]?.geometry.coordinates[0],
  }
}

export function useLocationCoordinates(
  location: {
    name: string
  } & Address
) {
  return useQuery({
    queryKey: ['location-coordinates', location],
    queryFn: () => getLocationCoordinates(location),
  })
}
