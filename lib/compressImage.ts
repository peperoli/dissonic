export function compressImage(
  file: File,
  maxWidth = 3000,
  maxHeight = 3000,
  type = 'image/webp',
  quality = 0.8
): Promise<{ compressedFile: File; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = e => {
      if (!e.target?.result || typeof e.target.result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }
      img.src = e.target.result
    }

    reader.onerror = err => reject(err)
    reader.readAsDataURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          const compressedFile = new File([blob], file.name, { type })
          resolve({ compressedFile, width: canvas.width, height: canvas.height })
        },
        type,
        quality
      )
    }
  })
}
