import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

const DIMENSION_LIMIT = 2500

export async function compressGif(
  file: File,
  options?: {
    maxWidth?: number
    maxHeight?: number
    crop?: boolean
    type?: string
    quality?: number
  }
): Promise<File> {
  if (file.type !== 'image/gif') {
    throw new Error('File is not a GIF')
  }

  const ffmpeg = new FFmpeg()
  const gifImage = await createImageBitmap(file)
  const { width, height } = gifImage
  gifImage.close()
  const crop = options?.crop ?? false
  const maxWidth = options?.maxWidth ?? DIMENSION_LIMIT
  const maxHeight = options?.maxHeight ?? DIMENSION_LIMIT

  await ffmpeg.load()
  await ffmpeg.writeFile(file.name, await fetchFile(file))
  const shortestSide = Math.min(width, height)
  const ratio = Math.min(maxWidth / shortestSide, maxHeight / shortestSide, 1)
  const outputSize = Math.max(2, Math.floor((shortestSide * ratio) / 2) * 2)
  const outputOptions = [
    '-vf',
    crop
      ? `crop=${shortestSide}:${shortestSide}:exact=1,scale=${outputSize}:${outputSize}`
      : 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
  ]

  await ffmpeg.exec([
    '-f',
    'gif',
    '-i',
    file.name,
    ...outputOptions,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    'output.mp4',
  ])
  const data = await ffmpeg.readFile('output.mp4')
  ffmpeg.terminate()

  if (typeof data === 'string') {
    throw new Error('Failed to convert GIF to MP4')
  }

  const mp4Buffer = new ArrayBuffer(data.byteLength)
  new Uint8Array(mp4Buffer).set(data)
  const mp4File = new File([mp4Buffer], 'output.mp4', { type: 'video/mp4' })

  return mp4File
}
