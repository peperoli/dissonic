import { uploadImageCloudflare } from '@/lib/uploadImageCloudflare'
import { uploadVideoCloudflare } from '@/lib/uploadVideoCloudflare'
import { Tables } from '@/types/supabase'
import { ChangeEvent, Dispatch, DragEvent, SetStateAction, useMemo, useState } from 'react'

export type MemoryFileItem = {
  id?: Tables<'memories'>['id']
  fileId: Tables<'memories'>['file_id'] | null
  bandId: Tables<'memories'>['band_id']
  duration: Tables<'memories'>['duration']
  file: File | { name?: null; type: string; size?: null }
  preview?: string | null
  isLoading?: boolean
  progress?: number | null
  error?: string | null
  isSuccess: boolean
}

export function useMemoriesControl(
  fileItems: MemoryFileItem[],
  setFileItems: Dispatch<SetStateAction<MemoryFileItem[]>>,
  options: { prefix?: string; acceptedFileTypes?: string[] }
) {
  const { prefix, acceptedFileTypes = [] } = options
  const [dragActive, setDragActive] = useState(false)

  const isSuccess = useMemo(
    () => fileItems.length > 0 && fileItems.every(item => !item.error && item.isSuccess),
    [fileItems]
  )

  function addFiles(files: File[]) {
    setFileItems(prevItems => [
      ...prevItems,
      ...files.map(file => ({
        file,
        fileId: null,
        bandId: null,
        duration: null,
        preview: URL.createObjectURL(file),
        isLoading: true,
        progress: 0,
        error: null,
        isSuccess: false,
      })),
    ])
  }

  async function uploadFiles(files: File[]) {
    await Promise.all(
      files.map(async file => {
        try {
          if (file.type.startsWith('image/')) {
            const { imageId } = await uploadImageCloudflare(file, {
              prefix,
              acceptedFileTypes,
            })

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file?.name === file.name
                  ? { ...item, fileId: imageId, isLoading: false, progress: 100, isSuccess: true }
                  : item
              )
            )
          } else if (file.type.startsWith('video/')) {
            const { videoId } = await uploadVideoCloudflare(file, {
              prefix,
              maxDuration: 60,
              onUploadProgress: progress => {
                setFileItems(prevItems =>
                  prevItems.map(item =>
                    item.file?.name === file.name ? { ...item, isLoading: true, progress } : item
                  )
                )
              },
            })

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file?.name === file.name
                  ? { ...item, fileId: videoId, isLoading: false, isSuccess: true }
                  : item
              )
            )
          }
        } catch (error) {
          console.error(error)
          setFileItems(prevItems =>
            prevItems.map(item =>
              item.file?.name === file.name
                ? {
                    ...item,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Unexpected error.',
                  }
                : item
            )
          )
        }
      })
    )
  }

  function onDrag(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  async function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files)
      addFiles(files)
      await uploadFiles(files)
    }
  }

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      addFiles(files)
      await uploadFiles(files)
    }
  }

  return {
    isDragActive: dragActive,
    onDrag,
    onDrop,
    onChange,
    isSuccess,
  }
}
