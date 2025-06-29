export function getR2ImageUrl(
  fileName: string,
  options: {
    width?: number
    height?: number
    fit?: 'contain' | 'scale-down' | 'cover'
    format?: string
    quality?: number
  } = {
    format: 'auto',
  }
) {
  const optionsString = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  return `https://dissonic.ch/cdn-cgi/image/${optionsString}/https://dissonic.ch/${fileName}`
}

export function getR2VideoUrl(
  fileName: string,
  options?: {
    width?: number
    height?: number
    fit?: 'contain' | 'scale-down' | 'cover'
  }
) {
  const optionsString = Object.entries({ mode: 'video', ...options })
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  return `https://dissonic.ch/cdn-cgi/media/${optionsString}/https://dissonic.ch/${fileName}`
}

export function getR2StillframeUrl(
  fileName: string,
  options?: {
    width?: number
    height?: number
    fit?: 'contain' | 'scale-down' | 'cover'
  }
) {
  const optionsString = Object.entries({ mode: 'frame', ...options })
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  return `https://dissonic.ch/cdn-cgi/media/${optionsString}/https://dissonic.ch/${fileName}`
}
