import { getImageUploadUrl } from '@/actions/files'

export async function uploadImageCloudflare(
  bucketName: string,
  file: File,
  options?: {
    folder?: string
    acceptedFileTypes?: string[]
    onUploadProgress?: (progress: number) => void
  }
) {
  const { id, uploadURL } = await getImageUploadUrl()
  const formData = new FormData()
  // const blob = new Blob([file], { type: file.type })
  formData.append('file', file)

  const response = await fetch(uploadURL, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': file.type,
    },
  })

  if (!response.ok) {
    console.error(response)
  }
}
