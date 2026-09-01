import * as tus from 'tus-js-client'

type UploadCredentials = {
  videoId: string
  libraryId: string
  expirationTime: number
  signature: string
  embedUrl: string
}

type UploadVideoBunnyOptions = {
  prefix?: string
  maxDuration?: number
  onUploadProgress?: (progress: number) => void
  signal?: AbortSignal
}

const BUNNY_TUS_ENDPOINT = 'https://video.bunnycdn.com/tusupload'

export async function uploadVideoBunny(file: File, options: UploadVideoBunnyOptions) {
  const fileName = options.prefix ? `${options.prefix}-${file.name}` : file.name

  if (file.type !== 'video/mp4') {
    throw new Error(`File type ${file.type} is not accepted. Expected video/mp4.`)
  }

  if (options.maxDuration) {
    await checkVideoDuration(file, options.maxDuration)
  }

  const response = await fetch('/api/bunny/upload-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: file.name }),
  })

  if (!response.ok) {
    throw new Error('Failed to get upload credentials')
  }

  const credentials = (await response.json()) as UploadCredentials

  return new Promise<{ fileName: string; videoId: string, videoUrl: string }>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: BUNNY_TUS_ENDPOINT,
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000],
      metadata: {
        filename: fileName,
        filetype: file.type,
      },
      headers: {
        AuthorizationSignature: credentials.signature,
        AuthorizationExpire: String(credentials.expirationTime),
        LibraryId: credentials.libraryId,
        VideoId: credentials.videoId,
      },
      removeFingerprintOnSuccess: true,
      onError: error => {
        reject(error)
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const progress = Math.round((bytesUploaded / bytesTotal) * 100)
        options.onUploadProgress?.(progress)
      },
      onSuccess: () => {
        resolve({ fileName, videoId: credentials.videoId, videoUrl: credentials.embedUrl })
      },
    })

    if (options.signal?.aborted) {
      reject(new DOMException('Upload aborted', 'AbortError'))
      return
    }

    const abortUpload = () => {
      void upload.abort(true)
      reject(new DOMException('Upload aborted', 'AbortError'))
    }

    options.signal?.addEventListener('abort', abortUpload, { once: true })

    void upload.findPreviousUploads().then(
      previousUploads => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }
        upload.start()
      },
      error => {
        reject(error)
      }
    )
  })
}

async function checkVideoDuration(file: File, maxDuration: number): Promise<void> {
  const duration = await new Promise<number>((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    video.onerror = function () {
      reject(new Error('Failed to load video metadata'))
    }
    video.src = URL.createObjectURL(file)
  })
  if (duration > maxDuration) {
    throw new Error(
      `Video duration ${Math.round(duration)}s exceeds maximum allowed duration of ${maxDuration}s.`
    )
  }
}
