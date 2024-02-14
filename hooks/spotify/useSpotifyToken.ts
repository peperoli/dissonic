import { useQuery } from '@tanstack/react-query'

const fetchToken = async (): Promise<string> => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET
  const authParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  }
  const data = await fetch('https://accounts.spotify.com/api/token', authParams)
    .then(response => response.json())
    .catch(error => console.error(error))

  return data.access_token
}

export const useSpotifyToken = () => {
  return useQuery(['spotifyAccessToken'], fetchToken)
}
