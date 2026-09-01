import { useQuery } from '@tanstack/react-query'
import { getBunnyVideoDetails } from '@/lib/bunnyHelpers'

export function useVideoDetails(videoId: string) {
  return useQuery({
    queryKey: ['video-details', videoId],
    queryFn: () => getBunnyVideoDetails(videoId),
  })
}
