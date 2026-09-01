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
