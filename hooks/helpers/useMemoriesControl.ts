import { uploadImageCloudflare } from '@/lib/uploadImageCloudflare'
import { uploadVideoCloudflare } from '@/lib/uploadVideoCloudflare'
import { ChangeEvent, DragEvent, useMemo, useState } from 'react'

export type FileItem = {
  file: File
  fileId: string | null
  preview: string | null
  isLoading: boolean
  progress: number
  error: string | null
  isSuccess: boolean
  bandId: number | null
}

export function useMemoriesControl(options: { prefix?: string; acceptedFileTypes?: string[] }) {
  const { prefix, acceptedFileTypes = [] } = options
  const [dragActive, setDragActive] = useState(false)
  const [fileItems, setFileItems] = useState<FileItem[]>([])

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
        preview: URL.createObjectURL(file),
        isLoading: true,
        progress: 0,
        error: null,
        isSuccess: false,
        bandId: null,
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
                item.file.name === file.name
                  ? { ...item, fileId: imageId, isLoading: false, isSuccess: true }
                  : item
              )
            )
          } else if (file.type.startsWith('video/')) {
            const { videoId } = await uploadVideoCloudflare(file, {
              prefix,
              acceptedFileTypes,
              onUploadProgress: progress => {
                setFileItems(prevItems =>
                  prevItems.map(item =>
                    item.file.name === file.name ? { ...item, isLoading: true, progress } : item
                  )
                )
              },
            })

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file.name === file.name
                  ? { ...item, fileId: videoId, isLoading: false, isSuccess: true }
                  : item
              )
            )
          }
        } catch (error) {
          console.error(error)
          setFileItems(prevItems =>
            prevItems.map(item =>
              item.file.name === file.name
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
    fileItems,
    setFileItems,
    isDragActive: dragActive,
    onDrag,
    onDrop,
    onChange,
    isSuccess,
  }
}
