export async function uploadImageBunny(
  file: File,
  options: { timestamp?: string | number; folder: 'full' | 'thumbnail' | 'mobile' }
): Promise<string> {
  const stem = file.name.split('.').slice(0, -1).join('.')
  const extension = file.type.split('/').at(-1)
  const fileName = `${options.timestamp ?? stem}.${extension}`
  const formData = new FormData()
  formData.append('file', file, `${options.folder}/${fileName}`)

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

  return fileName
}
