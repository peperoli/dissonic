import { GeoapifyResponse } from '@/types/geoapify'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

  const supabase = await createClient()

  const { data: locations, error } = await supabase.from('locations').select('*')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }

  const locationCoordinates = await Promise.all(
    locations.map(async location => {
      const searchParams = new URLSearchParams({
        apiKey,
        name: location.name,
        ...(location.street && { street: location.street }),
        ...(location.house_number && { housenumber: location.house_number }),
        ...(location.zip_code && { postcode: location.zip_code }),
        city: location.city,
        countrycodes: location.country_iso2.toLowerCase(),
      })

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?${searchParams.toString()}`
      )

      if (!response.ok) {
        console.error(
          `Failed to fetch coordinates for location ${location.id}:`,
          response.statusText
        )
        return {
          location_id: location.id,
          location_name: location.name,
          coordinates: null,
        }
      }

      const data: GeoapifyResponse = await response.json()

      const { error } = await supabase
        .from('locations')
        .update({
          latitude: data.features[0]?.geometry?.coordinates[1] || null,
          longitude: data.features[0]?.geometry?.coordinates[0] || null,
        })
        .eq('id', location.id)

      if (error) {
        console.error(`Error updating location ${location.id}:`, error)
      }

      return {
        location_id: location.id,
        location_name: location.name,
        coordinates: data.features[0]?.geometry?.coordinates,
      }
    })
  )

  return NextResponse.json(locationCoordinates, { status: 200 })
}
