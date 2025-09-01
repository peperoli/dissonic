// export function getR2ImageUrl(
//   fileName: string,
//   options: {
//     width?: number
//     height?: number
//     fit?: 'contain' | 'scale-down' | 'cover'
//     format?: string
//     quality?: number
//   } = {
//     format: 'auto',
//   }
// ) {
//   const optionsString = Object.entries(options)
//     .map(([key, value]) => `${key}=${value}`)
//     .join(',')
//   return `https://dissonic.ch/cdn-cgi/image/${optionsString}/https://dissonic.ch/${fileName}`
// }

import { object } from 'zod'

// export function getR2VideoUrl(
//   fileName: string,
//   options?: {
//     width?: number
//     height?: number
//     fit?: 'contain' | 'scale-down' | 'cover'
//   }
// ) {
//   const optionsString = Object.entries({ mode: 'video', ...options })
//     .map(([key, value]) => `${key}=${value}`)
//     .join(',')
//   return `https://dissonic.ch/cdn-cgi/media/${optionsString}/https://dissonic.ch/${fileName}`
// }

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
