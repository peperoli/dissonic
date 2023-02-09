import { useQuery } from 'react-query'

interface SpotifyOEmbed {
  html: string
}

const fetchSpotifyArtist = async (artistId?: string | null): Promise<SpotifyOEmbed> => {
  if (!artistId) {
    throw new Error('No artist ID')
  }

  const query = encodeURIComponent(`https://open.spotify.com/artist/${artistId}`)
  const data = await fetch(`https://open.spotify.com/oembed?url=${query}`)

  return data.json()
}

export const useSpotifyArtist = (artistId?: string | null) => {
  return useQuery(['artist', artistId], () => fetchSpotifyArtist(artistId), {
    enabled: !!artistId,
  })
}
