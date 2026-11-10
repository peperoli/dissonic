import { GeoapifyResponse } from '@/types/geoapify'
import { useQuery } from '@tanstack/react-query'

async function autocompleteAddress(query: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY
  const searchParams = new URLSearchParams({
    apiKey,
    text: query,
  })
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?${searchParams.toString()}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to lookup address: ${response.statusText}`)
  }

  const data: GeoapifyResponse = await response.json()

  return data.features
}

export function useAutocompleteAddress(locationName: string) {
  return useQuery({
    queryKey: ['autocompleteAddress', locationName],
    queryFn: () => autocompleteAddress(locationName),
    enabled: locationName.length > 1,
  })
}
