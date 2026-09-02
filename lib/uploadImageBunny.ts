export async function uploadImageBunny(
  file: File,
  options: { prefix?: string; suffix?: string } = {}
): Promise<string> {
  const stem = file.name.split('.').slice(0, -1).join('.')
  const extension = file.type.split('/').at(-1)
  const fileName = `${options.prefix ?? ''}${stem}${options.suffix ?? ''}.${extension}`
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

  const { filename } = await response.json()

  return filename
}
