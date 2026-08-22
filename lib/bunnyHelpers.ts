export function getBunnyVideoUrl(videoId: string): string {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID

  return `https://player.mediadelivery.net/play/${libraryId}/${videoId}`
}


type VideoDetails = {
  length: number
  width: number
  height: number
  thumbnailUrl: string
}

export async function getBunnyVideoDetails(videoId: string): Promise<VideoDetails> {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID

  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/play`,
    {
      method: 'GET',
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Failed to get Bunny video details:', error)
    throw new Error('Failed to get Bunny video details')
  }

  return await response.json()
}
