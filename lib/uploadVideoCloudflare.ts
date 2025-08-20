import * as tus from 'tus-js-client'

export async function uploadVideoCloudflare(
  file: File,
  options?: {
    prefix?: string
    acceptedFileTypes?: string[]
    onUploadProgress?: (progress: number) => void
    onSuccess?: () => void
  }
) {
  const fileName = `concert-memories-${Date.now()}`
  
  return new Promise<{ fileName: string }>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: '/api/cloudflare/get-stream-upload-url',
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 3000, 5000],
      metadata: {
        name: fileName,
        type: file.type,
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess

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
        if (options?.onSuccess) {
          options.onSuccess()
        }
        resolve({ fileName })
      },
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      // Start the upload
      upload.start()
    }).catch(reject)
  })
}
