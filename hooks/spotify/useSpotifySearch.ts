import { useQuery } from '@tanstack/react-query'
import { SpotifyArtist } from '@/types/types'
import { useSpotifyToken } from './useSpotifyToken'

const fetchSearch = async (
  token?: string | null,
  bandName?: string | null
): Promise<SpotifyArtist[]> => {
  const artistParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const data = await fetch(
    `https://api.spotify.com/v1/search?q=${bandName}&type=artist`,
    artistParams
  )
    .then(response => response.json())
    .catch(error => console.error(error))

  return data.artists?.items
}

export const useSpotifySearch = (bandName: string | null) => {
  const { data: token } = useSpotifyToken()
  return useQuery(['spotifySearch', bandName], () => fetchSearch(token, bandName), {
    enabled: !!token && !!bandName,
  })
}
