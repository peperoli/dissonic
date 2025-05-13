import { useQuery } from '@tanstack/react-query'
import { SpotifyArtist } from '@/types/types'
import { useSpotifyToken } from './useSpotifyToken'

export async function fetchSpotifyArtist(token: string | null, artistId: string | null) {
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

export const useSpotifyArtist = (artistId: string | null, options?: { enabled?: boolean }) => {
  const HOUR = 1000 * 3600
  const { data: token } = useSpotifyToken()

  return useQuery({
    queryKey: ['spotifyArtist', artistId],
    queryFn: () => fetchSpotifyArtist(token ?? null, artistId),
    staleTime: HOUR * 24,
    gcTime: HOUR,
    enabled: !!token && !!artistId && options?.enabled !== false,
  })
}
