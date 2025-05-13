import { BandPage } from '../../../components/bands/BandPage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { notFound } from 'next/navigation'
import { fetchSpotifyToken } from '@/hooks/spotify/useSpotifyToken'
import { fetchSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import { SpotifyArtist } from '@/types/types'
import { ResolvingMetadata } from 'next'

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
) {
  const params = await props.params
  const band = await fetchData(params)
  const spotifyToken = await fetchSpotifyToken()
  const spotifyArtist = await fetchSpotifyArtist(spotifyToken, band.spotify_artist_id)
  const artistImage =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[0] || spotifyArtist?.images?.[0]
  const parentImages = (await parent).openGraph?.images || []

  return {
    title: `${band.name} • Dissonic`,
    openGraph: {
      images: artistImage ? [artistImage.url] : parentImages,
    },
  }
}

export async function generateStaticParams() {
  const { data: bands, error } = await supabase.from('bands').select('id').eq('is_archived', false)

  if (error) {
    throw error
  }

  return bands?.map(band => ({ id: band.id.toString() }))
}

async function fetchData(params: { id: string }) {
  const supabase = await createClient()
  const bandId = parseInt(params.id)

  if (Number.isNaN(bandId)) {
    notFound()
  }

  const { data, error } = await supabase
    .from('bands')
    .select(
      `*,
      country:countries(id, iso2),
      genres(*),
      creator:profiles!bands_creator_id_fkey(*)`
    )
    .eq('id', bandId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      notFound()
    }

    throw error
  }

  return data
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const band = await fetchData(params)
  const cookieStore = await cookies()
  return (
    <BandPage initialBand={band} bandQueryState={cookieStore.get('bandsLastQueryState')?.value} />
  )
}
