import { useQuery } from '@tanstack/react-query'
import { SpotifyArtist } from '@/types/types'
import { useSpotifyToken } from './useSpotifyToken'

const fetchSpotifyArtist = async (token?: string | null, artistId?: string | null) => {
  const artistParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const data: Promise<SpotifyArtist> = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    artistParams
  )
    .then(response => response.json())
    .catch(error => console.error(error))

  return data
}

export const useSpotifyArtist = (artistId?: string | null) => {
  const { data: token } = useSpotifyToken()
  return useQuery({
    queryKey: ['spotifyArtist', artistId],
    queryFn: () => fetchSpotifyArtist(token, artistId),
    enabled: !!token && !!artistId,
  })
}
