type VideoDetails = {
  length: number
  width: number
  height: number
  thumbnailUrl: string
}

export async function getBunnyVideoDetails(videoId: string): Promise<VideoDetails> {
  const response = await fetch(
    `https://video.bunnycdn.com/library/${process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID}/videos/${videoId}/play`,
    {
      method: 'GET',
      // headers: {
      //   AccessKey: process.env.NEXT_PUBLIC_STREAM_READ_API_KEY,
      // },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Failed to get Bunny video details:', error)
    throw new Error('Failed to get Bunny video details')
  }

  return await response.json()
}
