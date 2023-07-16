import { useQuery } from '@tanstack/react-query'

interface SpotifyOEmbed {
  html: string
}

const fetchSpotifyArtistEmbed = async (artistId?: string | null): Promise<SpotifyOEmbed> => {
  if (!artistId) {
    throw new Error('No artist ID')
  }

  const query = encodeURIComponent(`https://open.spotify.com/artist/${artistId}`)
  const data = await fetch(`https://open.spotify.com/oembed?url=${query}`)

  return data.json()
}

export const useSpotifyArtistEmbed = (artistId?: string | null) => {
  return useQuery(['spotifyArtistEmbed', artistId], () => fetchSpotifyArtistEmbed(artistId), {
    enabled: !!artistId,
  })
}
