import { useQuery } from '@tanstack/react-query'
import { SpotifyArtist } from '@/types/types'
import { useSpotifyToken } from './useSpotifyToken'

const fetchSpotifyArtist = async (
  token?: string | null,
  bandId?: string | null
) => {
  const artistParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const data: Promise<SpotifyArtist> = await fetch(`https://api.spotify.com/v1/artists/${bandId}`, artistParams)
    .then(response => response.json())
    .catch(error => console.error(error))
  
  return data
}

export const useSpotifyArtist = (bandId?: string | null) => {
  const { data: token } = useSpotifyToken()
  return useQuery(['spotifyArtist', bandId], () => fetchSpotifyArtist(token, bandId), {
    enabled: !!token && !!bandId,
  })
}
