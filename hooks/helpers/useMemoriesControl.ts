import { uploadFileS3 } from '@/lib/uploadFileS3'
import { uploadImageCloudflare } from '@/lib/uploadImageCloudflare'
import { ChangeEvent, DragEvent, useMemo, useState } from 'react'

export type FileItem = {
  file: File
  preview: string
  isLoading: boolean
  progress: number
  error: string | null
  isSuccess: boolean
}

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
}

export function useMemoriesControl(options: UseMemoriesControlOptions) {
  const {
    bucketName,
    folder,
    acceptedFileTypes = [],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = Number.POSITIVE_INFINITY,
  } = options
  const [fileItems, setFileItems] = useState<FileItem[]>([])
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
        preview: URL.createObjectURL(file),
        isLoading: false,
        progress: 0,
        error: null,
        isSuccess: false,
      })),
    ])
  }

  async function uploadFiles(files: File[]) {
    await Promise.all(
      files.map(async file => {
        await uploadImageCloudflare(bucketName, file, {
          folder,
          acceptedFileTypes,
          onUploadProgress: progress => {
            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file.name === file.name ? { ...item, isLoading: true, progress } : item
              )
            )
          },
        })
          .then(() => {
            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file.name === file.name ? { ...item, isLoading: false, isSuccess: true } : item
              )
            )
          })
          .catch(error => {
            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file.name === file.name
                  ? { ...item, isLoading: false, error: error.message }
                  : item
              )
            )
          })
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
