import * as tus from 'tus-js-client'

export async function uploadVideoCloudflare(
  file: File,
  options?: {
    prefix?: string
    maxDuration?: number // in seconds
    onUploadProgress?: (progress: number) => void
  }
) {
  const fileName = `concert-memories-${file.name}`

  if (!file.type.startsWith('video/')) {
    throw new Error(`File type ${file.type} is not accepted.`)
  }

  if (options?.maxDuration) {
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
    if (duration > options.maxDuration) {
      throw new Error(
        `Video duration ${Math.round(duration)}s exceeds maximum allowed duration of ${options.maxDuration}s.`
      )
    }
  }

  return new Promise<{ fileName: string; videoId: string }>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: '/api/cloudflare/get-stream-upload-url',
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 3000, 5000],
      metadata: {
        name: fileName,
        type: file.type,
      },
      onError: function (error) {
        reject(error)
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const progress = Math.round((bytesUploaded / bytesTotal) * 100)

        if (options?.onUploadProgress) {
          options.onUploadProgress(progress)
        }
      },
      onSuccess: function () {
        // Extract UID from the upload URL
        const uploadUrl = upload.url
        const videoId = uploadUrl ? new URL(uploadUrl).pathname.split('/').pop() : null

        if (!videoId) {
          reject(new Error('Failed to extract video ID from upload URL'))
          return
        }

        resolve({ fileName, videoId })
      },
    })

    upload.start()
  })
}
