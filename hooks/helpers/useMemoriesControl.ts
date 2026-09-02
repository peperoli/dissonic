import { compressImage } from '@/lib/compressImage'
import { uploadImageBunny } from '@/lib/uploadImageBunny'
import { uploadVideoBunny } from '@/lib/uploadVideoBunny'
import { Tables } from '@/types/supabase'
import supabase from '@/utils/supabase/client'
import { ChangeEvent, Dispatch, DragEvent, SetStateAction, useMemo, useState } from 'react'
import { Temporal } from 'temporal-polyfill'

export type MemoryFileItem = {
  id?: Tables<'memories'>['id']
  fileId: Tables<'memories'>['file_id'] | null
  bandId: Tables<'memories'>['band_id']
  duration: Tables<'memories'>['duration']
  file: File | { name?: null; type: string; size?: null }
  width?: number
  height?: number
  preview?: string | null
  isLoading?: boolean
  progress?: number | null
  error?: string | null
  isSuccess: boolean
}

export function useMemoriesControl(
  concertId: number,
  fileItems: MemoryFileItem[],
  setFileItems: Dispatch<SetStateAction<MemoryFileItem[]>>
) {
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
            const [full, thumbnail, mobile] = await Promise.all([
              compressImage(file),
              compressImage(file, { maxWidth: 400, maxHeight: 400 }),
              compressImage(file, { maxWidth: 800 }),
            ])

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file?.name === file.name
                  ? {
                      ...item,
                      progress: 50,
                      file_type: full.compressedFile.type,
                      width: full.width,
                      height: full.height,
                    }
                  : item
              )
            )

            const timestamp = Temporal.Now.instant().epochMilliseconds
            const filenames = await Promise.all([
              uploadImageBunny(full.compressedFile, { prefix: `${timestamp}-` }),
              uploadImageBunny(thumbnail.compressedFile, {
                prefix: `${timestamp}-`,
                suffix: '-thumbnail',
              }),
              uploadImageBunny(mobile.compressedFile, {
                prefix: `${timestamp}-`,
                suffix: '-mobile',
              }),
            ])

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file?.name === file.name
                  ? {
                      ...item,
                      fileId: filenames[0],
                      isLoading: false,
                      progress: 100,
                      isSuccess: true,
                    }
                  : item
              )
            )
          } else if (file.type.startsWith('video/')) {
            const { videoId } = await uploadVideoBunny(file, {
              maxDuration: 60,
              onUploadProgress: progress => {
                setFileItems(prevItems =>
                  prevItems.map(item =>
                    item.file?.name === file.name ? { ...item, isLoading: true, progress } : item
                  )
                )
              },
            })

            const { error } = await supabase.from('video_uploads').insert({
              video_id: videoId,
              concert_id: concertId,
            })

            if (error) {
              throw error
            }

            setFileItems(prevItems =>
              prevItems.map(item =>
                item.file?.name === file.name
                  ? { ...item, fileId: videoId, isLoading: false, isSuccess: true }
                  : item
              )
            )
          } else {
            throw new Error(`Unsupported file type: ${file.type}`)
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
