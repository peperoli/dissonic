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

  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, artistParams)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data: SpotifyArtist = await response.json()

    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Error fetching Spotify artist')
  }
}

export const useSpotifyArtist = (artistId?: string | null, options?: { enabled?: boolean }) => {
  const { data: token } = useSpotifyToken()
  const HOUR = 1000 * 3600
  return useQuery({
    queryKey: ['spotifyArtist', artistId],
    queryFn: () => fetchSpotifyArtist(token, artistId),
    staleTime: HOUR * 24,
    gcTime: HOUR,
    enabled: !!token && !!artistId && options?.enabled !== false,
  })
}
