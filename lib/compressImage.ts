const DIMENSION_LIMIT = 2500

export function compressImage(
  file: File,
  options?: {
    maxWidth?: number
    maxHeight?: number
    type?: string
    quality?: number
  }
): Promise<{ compressedFile: File; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    const maxWidth = options?.maxWidth ?? DIMENSION_LIMIT
    const maxHeight = options?.maxHeight ?? DIMENSION_LIMIT
    const type = options?.type ?? 'image/webp'
    const quality = options?.quality ?? 0.8

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

      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          const stem = file.name.split('.').slice(0, -1).join('.')
          const extension = type.split('/').at(-1)
          const fileName = `${stem}.${extension}`
          const compressedFile = new File([blob], fileName, { type: type })

          resolve({ compressedFile, width: canvas.width, height: canvas.height })
        },
        type,
        quality
      )
    }
  })
}
