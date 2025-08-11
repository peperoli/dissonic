import { getImageUploadUrl } from '@/actions/files'

export async function uploadImageCloudflare(
  file: File,
  options?: {
    prefix?: string
    acceptedFileTypes?: string[]
    onUploadProgress?: (progress: number) => void
  }
) {
  const { id, uploadURL } = await getImageUploadUrl()
  const fileExtension = file.type.split('/').at(-1)
  const fileName = options?.prefix
    ? `${options.prefix}-${id}.${fileExtension}`
    : `${id}.${fileExtension}`
  const formData = new FormData()
  formData.append('file', file, fileName)

  if (options?.onUploadProgress) {
    options.onUploadProgress(0)
  }

  const response = await fetch(uploadURL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    console.error(file.name, response)
    throw new Error(`Failed to upload file: ${file.name}`)
  }

  if (options?.onUploadProgress) {
    options.onUploadProgress(1)
  }

  return { fileName }
}
