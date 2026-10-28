import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = 'tystvA9HenQhBo5ww0ys'

  const supabase = await createClient()

  const { data: locations, error } = await supabase.from('locations').select('*')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }

  const locationCoordinates = await Promise.all(
    locations.map(async location => {
      const query = encodeURIComponent(
        `${location.name} ${location.alt_names} ${location.city} ${location.zip_code}`
      )
      const searchParams = new URLSearchParams({
        key: apiKey,
        types: 'place,address,locality',
        country: location.country_iso2.toLowerCase(),
      })
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${query}.json?${searchParams.toString()}`
      )

      const data = await response.json()

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

      return { location_id: location.id, coordinates: data.features[0]?.geometry?.coordinates }
    })
  )

  return NextResponse.json(locationCoordinates, { status: 200 })
}
