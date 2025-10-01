import { getImageUploadUrl } from '@/actions/files'

export async function uploadImageCloudflare(
  file: File,
  options?: {
    prefix?: string
    acceptedFileTypes?: string[]
  }
) {
  const { imageId, uploadURL } = await getImageUploadUrl()
  const fileExtension = file.type.split('/').at(-1)
  const fileName = options?.prefix
    ? `${options.prefix}-${imageId}.${fileExtension}`
    : `${imageId}.${fileExtension}`
  const formData = new FormData()
  formData.append('file', file, fileName)

  const response = await fetch(uploadURL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    console.error(file.name, response)
    throw new Error(`Failed to upload file: ${file.name}`)
  }

  return { imageId }
}
