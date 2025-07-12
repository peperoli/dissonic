import {
  completeMultipartUpload,
  getCreateMultipartUploadUrl,
  getPutObjectUrl,
  getUploadPartUrls,
} from '@/actions/files'
import { Memory } from '@/components/concerts/ConcertLogForm'
import { Tables } from '@/types/supabase'
import supabase from '@/utils/supabase/client'

export async function uploadMemory(
  memory: Exclude<Memory, Tables<'memories'>>,
  concertId: number,
  options?: { onUploadProgress?: (progress: number) => void }
) {
  try {
    const PART_SIZE = 5 * 1024 * 1024 // 5 MB
    const fileName = `${Date.now()}-${memory.file.name}`
    const dimensions: { width: number | null; height: number | null } = {
      width: null,
      height: null,
    }
    const totalSize = memory.file.size

    if (totalSize < PART_SIZE) {
      const { signedUrl } = await getPutObjectUrl(fileName)

      if (memory.file.type.startsWith('image/')) {
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

        reader.readAsDataURL(memory.file)
      }

      await fetch(signedUrl, {
        method: 'PUT',
        body: memory.file,
        headers: {
          'Content-Type': memory.file.type,
        },
      })
    } else {
      const { uploadId } = await getCreateMultipartUploadUrl(fileName)
      const partsCount = Math.ceil(totalSize / PART_SIZE)
      let uploadedBytes = 0

      const { uploadPartUrls } = await getUploadPartUrls(fileName, uploadId, partsCount)

      const uploadResponses = await Promise.all(
        uploadPartUrls.map((url, index) => {
          const start = index * PART_SIZE
          const end = Math.min(start + PART_SIZE, totalSize)
          const part = memory.file.slice(start, end)
          const response = fetch(url, {
            method: 'PUT',
            body: part,
            headers: {
              'Content-Type': memory.file.type,
            },
          })
          uploadedBytes += part.size

          if (options?.onUploadProgress) {
            console.log('Upload progress:', Math.round(uploadedBytes / totalSize * 100) + '%')
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

      await completeMultipartUpload(fileName, uploadId, parts)
    }

    const { error: insertMemoriesError } = await supabase.from('memories').insert({
      concert_id: concertId,
      band_id: memory.band_id,
      file_name: fileName,
      file_size: memory.file.size,
      file_type: memory.file.type,
      file_width: dimensions.width,
      file_height: dimensions.height,
    })

    if (insertMemoriesError) {
      throw insertMemoriesError
    }
  } catch (error) {
    throw error
  }
}