import {
  completeMultipartUpload,
  getCreateMultipartUploadUrl,
  getPutObjectUrl,
  getUploadPartUrls,
} from '@/actions/files'

export async function uploadFile(
  bucketName: string,
  file: File,
  options?: {
    folder?: string
    acceptedFileTypes?: string[]
    onUploadProgress?: (progress: number) => void
  }
) {
  try {
    const PART_SIZE = 5 * 1024 * 1024 // 5 MB
    const fileName = `${Date.now()}-${file.name}`
    const dimensions: { width: number | null; height: number | null } = {
      width: null,
      height: null,
    }
    const totalSize = file.size

    if (totalSize < PART_SIZE) {
      const { signedUrl } = await getPutObjectUrl(fileName)

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()

        reader.onload = event => {
          const img = new Image()
          img.onload = () => {
            dimensions.width = img.width
            dimensions.height = img.height
          }
          if (!event.target?.result) {
            throw new Error('Failed to read file')
          }
          img.src = event.target?.result as string
        }

        reader.readAsDataURL(file)
      }

      await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
    } else {
      const { uploadId } = await getCreateMultipartUploadUrl(bucketName, fileName)
      const partsCount = Math.ceil(totalSize / PART_SIZE)
      let uploadedBytes = 0

      const { uploadPartUrls } = await getUploadPartUrls(bucketName, fileName, uploadId, partsCount)

      const uploadResponses = await Promise.all(
        uploadPartUrls.map((url, index) => {
          const start = index * PART_SIZE
          const end = Math.min(start + PART_SIZE, totalSize)
          const part = file.slice(start, end)
          const response = fetch(url, {
            method: 'PUT',
            body: part,
            headers: {
              'Content-Type': file.type,
            },
          })
          uploadedBytes += part.size

          if (options?.onUploadProgress) {
            console.log('Upload progress:', Math.round((uploadedBytes / totalSize) * 100) + '%')
            options.onUploadProgress(Math.min(uploadedBytes / totalSize, 1))
          }

          return response
        })
      )

      const parts = uploadResponses.map((response, index) => {
        const eTag = response.headers.get('ETag')

        if (!eTag) {
          throw new Error(`ETag missing in part ${index + 1}`)
        }

        return {
          ETag: eTag,
          PartNumber: index + 1,
        }
      })

      await completeMultipartUpload(bucketName, fileName, uploadId, parts)
    }
  } catch (error) {
    throw error
  }
}
