import Cloudflare from 'cloudflare'

export function getCloudflareImageUrl(
  imageId: string,
  options?: {
    width?: number
    height?: number
    fit?: 'contain' | 'scale-down' | 'cover'
  }
) {
  const optionsString = Object.entries({ ...options })
    .map(([key, value]) => `${key}=${value}`)
    .join(',')

  return `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${optionsString}`
}

export function getCloudflareVideoUrl(videoId: string) {
  return `https://customer-bwyzo46pfd5dc1rh.cloudflarestream.com/${videoId}/manifest/video.mpd`
}

export function getCloudflareThumbnailUrl(
  videoId: string,
  options?: {
    time?: string
    width?: number
    height?: number
  }
) {
  const searchParams = new URLSearchParams(
    Object.entries({ ...options }).map(([key, value]) => [key, String(value)])
  )

  return `https://customer-bwyzo46pfd5dc1rh.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?${searchParams.toString()}`
}

export async function getCloudflareVideoDimensions(videoId: string) {
  const response = await fetch(`/api/cloudflare/get-video-details?videoId=${videoId}`)

  const video: Cloudflare.Stream.Video = await response.json()

  return {
    width: video.input?.width ?? null,
    height: video.input?.height ?? null,
  }
}
