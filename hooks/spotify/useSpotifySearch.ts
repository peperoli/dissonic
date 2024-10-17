import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { SpotifyArtist } from '@/types/types'
import { useSpotifyToken } from './useSpotifyToken'

const fetchSearch = async (
  bandName: string | null,
  token?: string | null,
  options?: { limit?: number }
): Promise<SpotifyArtist[]> => {
  const searchParams = new URLSearchParams({
    q: bandName || '',
    type: 'artist',
    limit: `${options?.limit || 10}`,
  })

  const data = await fetch(`https://api.spotify.com/v1/search?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .catch(error => console.error(error))

  return data.artists?.items
}

export const useSpotifySearch = (bandName: string | null, options?: { limit?: number }) => {
  const { data: token } = useSpotifyToken()
  return useQuery({
    queryKey: ['spotifySearch', bandName, JSON.stringify(options)],
    queryFn: () => fetchSearch(bandName, token, options),
    enabled: !!token && !!bandName,
    placeholderData: keepPreviousData,
  })
}
