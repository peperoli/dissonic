import { useQuery } from 'react-query'
import { SpotifyArtist } from '../types/types'
import { useSpotifyToken } from './useSpotifyToken'

const fetchArtist = async (token: string | null | undefined, bandId: string | null): Promise<SpotifyArtist> => {
  const artistParams = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  const data = await fetch(`https://api.spotify.com/v1/artists/${bandId}`, artistParams)
    .then(response => response.json())
    .catch(error => console.error(error))

  return data
}

export const useSpotifyArtist = (bandId: string | null) => {
  const { data: token } = useSpotifyToken()
  return useQuery(['spotifyArtist', bandId], () => fetchArtist(token, bandId), {
    enabled: !!token && !!bandId,
  })
}
