export const BUNNY_STREAM_PULL_ZONE = 'vz-335be0a4-28b'
export const BUNNY_LIBRARY_ID = '733737'
export const BUNNY_STORAGE_ZONE = 'concert-memories'

export function getBunnyImageUrl(filename: string): string {
  const pullZone = BUNNY_STORAGE_ZONE

  return `https://${pullZone}.b-cdn.net/${filename}`
}

export function getBunnyVideoUrl(videoId: string): string {
  const pullZone = BUNNY_STREAM_PULL_ZONE

  return `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8`
}

export function getBunnyThumbnailUrl(videoId: string) {
  const pullZone = BUNNY_STREAM_PULL_ZONE

  return `https://${pullZone}.b-cdn.net/${videoId}/thumbnails/thumbnail.jpg`
}

type VideoDetails = {
  video: {
    length: number
    rotation: number
    width: number
    height: number
  }
  thumbnailUrl: string
}

export async function getBunnyVideoDetails(videoId: string): Promise<VideoDetails> {
  const libraryId = BUNNY_LIBRARY_ID

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
