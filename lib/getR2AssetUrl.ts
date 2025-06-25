export function getR2AssetUrl(
  fileName: string,
  options: { width?: number; height?: number; format?: string; quality?: number } = {
    format: 'auto',
  }
): string {
  const optionsString = Object.entries(options || {})
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  return `https://dissonic.ch/cdn-cgi/image/${optionsString}/https://dissonic.ch/${fileName}`
}
