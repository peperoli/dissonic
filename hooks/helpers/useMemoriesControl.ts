import { LogFields } from '@/components/concerts/ConcertLogForm'
import { uploadImageCloudflare } from '@/lib/uploadImageCloudflare'
import { uploadVideoCloudflare } from '@/lib/uploadVideoCloudflare'
import { Tables } from '@/types/supabase'
import { ChangeEvent, DragEvent, useMemo, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'

export type MemoryFileItem = {
  file: File | null
  cloudflare_file_id: string | null
  preview: string
  isLoading: boolean
  progress: number
  error: string | null
  isSuccess: boolean
  bandId: number | null
} & Partial<Tables<'memories'>>

type UseMemoriesControlOptions = {
  /**
   * Name of bucket to upload files to in your Supabase project
   */
  bucketName: string
  /**
   * Folder to upload files to in the specified bucket within your Supabase project.
   *
   * Defaults to uploading files to the root of the bucket
   *
   * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
   */
  folder?: string
  /**
   * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
   *
   * Defaults to allowing uploading of all MIME types.
   */
  acceptedFileTypes?: string[]
  /**
   * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
   */
  maxFileSize?: number
  /**
   * Maximum number of files allowed per upload.
   */
  maxFiles?: number
  memoryFileItems: MemoryFileItem[]
  setMemoryFileItems: (items: MemoryFileItem[]) => void
}

export function useMemoriesControl(options: UseMemoriesControlOptions) {
  const {
    bucketName,
    folder,
    acceptedFileTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = Number.POSITIVE_INFINITY,
    memoryFileItems,
    setMemoryFileItems,
  } = options
  const [dragActive, setDragActive] = useState(false)
  const isSuccess = useMemo(
    () =>
      memoryFileItems.length > 0 && memoryFileItems.every(item => !item.error && item.isSuccess),
    [memoryFileItems]
  )

  function addFiles(files: File[]) {
    setMemoryFileItems(
      files.map(file => ({
        file,
        cloudflare_file_id: null,
        file_type: file.type,
        preview: URL.createObjectURL(file),
        isLoading: false,
        progress: 0,
        error: null,
        isSuccess: false,
        bandId: null,
      }))
    )
  }

  async function uploadFiles(files: File[]) {
    await Promise.all(
      files.map(async file => {
        try {
          if (file.type.startsWith('image/')) {
            const { imageId } = await uploadImageCloudflare(file, {
              prefix: 'concert-memories',
              acceptedFileTypes,
            })

            memoryFileItems.forEach((item, index) => {
              if (item.file?.name === file.name) {
                const newItems = [...memoryFileItems]
                newItems[index] = {
                  ...item,
                  cloudflare_file_id: imageId,
                  isLoading: false,
                  isSuccess: true,
                }
                setMemoryFileItems(newItems)
              }
            })
          } else if (file.type.startsWith('video/')) {
            // Set initial loading state for video upload
            memoryFileItems.forEach((item, index) => {
              if (item.file?.name === file.name) {
                const newItems = [...memoryFileItems]
                newItems[index] = {
                  ...item,
                  isLoading: true,
                  progress: 0,
                }
                setMemoryFileItems(newItems)
              }
            })

            const { fileName } = await uploadVideoCloudflare(file, {
              prefix: 'concert-memories',
              acceptedFileTypes,
              onUploadProgress: progress => {
                memoryFileItems.forEach((item, index) => {
                  if (item.file?.name === file.name) {
                    const newItems = [...memoryFileItems]
                    newItems[index] = {
                      ...item,
                      progress,
                      isLoading: true,
                    }
                    setMemoryFileItems(newItems)
                  }
                })
              },
              onSuccess: () => {
                memoryFileItems.forEach((item, index) => {
                  if (item.file?.name === file.name) {
                    const newItems = [...memoryFileItems]
                    newItems[index] = {
                      ...item,
                      cloudflare_file_id: fileName,
                      isLoading: false,
                      isSuccess: true,
                    }
                    setMemoryFileItems(newItems)
                  }
                })
              },
            })
          }
        } catch (error) {
          memoryFileItems.forEach((item, index) => {
            if (item.file?.name === file.name) {
              const newItems = [...memoryFileItems]
              newItems[index] = {
                ...item,
                isLoading: false,
                error: error instanceof Error ? error.message : JSON.stringify(error),
              }
              setMemoryFileItems(newItems)
            }
          })
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
