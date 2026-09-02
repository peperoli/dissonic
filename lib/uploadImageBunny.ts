import { Temporal } from 'temporal-polyfill'

export async function uploadImageBunny(file: File) {
  const imageId = Temporal.Now.instant().epochMilliseconds
  const fileExtension = file.type.split('/').at(-1)
  const fileName = `${imageId}.${fileExtension}`
  const formData = new FormData()
  formData.append('file', file, fileName)

  if (!file.type.startsWith('image/')) {
    throw new Error(`File type ${file.type} is not accepted. Expected image/*.`)
  }

  const response = await fetch('/api/bunny/upload-image', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    console.error(file.name, response)
    throw new Error(`Failed to upload file: ${file.name}`)
  }

  const { filename, url } = await response.json()

  return { filename, url }
}
