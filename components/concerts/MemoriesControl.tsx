import { Band } from '@/types/types'
import clsx from 'clsx'
import { FileIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { MemoryFileItem, useMemoriesControl } from '@/hooks/helpers/useMemoriesControl'
import { LogFields } from './ConcertLogForm'
import { getCloudflareImageUrl } from '@/lib/cloudflareHelpers'

export function MemoriesControl({
  label,
  name,
  memoryFileItems,
  setMemoryFileItems,
  acceptedFileTypes,
  bands,
  concertId,
}: {
  label: string
  name: string
  memoryFileItems: MemoryFileItem[]
  setMemoryFileItems: (items: MemoryFileItem[]) => void
  acceptedFileTypes?: string[]
  bands: Band[]
  concertId: number | null
}) {
  const { isDragActive, onDrag, onDrop, onChange } = useMemoriesControl({
    bucketName: 'concert-memories',
    folder: concertId?.toString(),
    acceptedFileTypes,
    memoryFileItems,
    setMemoryFileItems,
  })
  const ref = useRef(null)
  const t = useTranslations('MultiFileInput')

  return (
    <div className="grid">
      <label htmlFor={name}>
        <div className="mb-2 text-sm text-slate-300">{label}</div>
        <input
          type="file"
          id={name}
          name={name}
          accept={acceptedFileTypes?.join(',')}
          multiple
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          role="button"
          ref={ref}
          onDrag={onDrag}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          className={clsx(
            'w-full cursor-pointer rounded-lg border-2 border-slate-500 bg-slate-750 p-6 text-center peer-focus:outline peer-focus:ring-2',
            !isDragActive && 'border-dashed'
          )}
        >
          <span className="text-center text-slate-300">
            {isDragActive
              ? 'Dateien hier ablegen'
              : t.rich('dragOrBrowseFiles', {
                  span: chunk => (
                    <span className="cursor-pointer font-bold hover:text-venom">{chunk}</span>
                  ),
                })}
          </span>
        </div>
      </label>
      <div className="mt-2 grid gap-4 rounded-lg bg-slate-750 p-4">
        {memoryFileItems.map((memoryFileItem, index) => {
          return (
            <MemoryItem
              memoryFileItem={memoryFileItem}
              setMemoryFileItem={item => {
                const newItems = [...memoryFileItems]
                newItems[index] = item
                setMemoryFileItems(newItems)
              }}
              index={index}
              onRemove={() => {
                const newItems = memoryFileItems.filter((_, i) => i !== index)
                setMemoryFileItems(newItems)
              }}
              bands={bands}
              key={index}
            />
          )
        })}
      </div>
      <pre className="max-w-xl overflow-auto">{JSON.stringify(memoryFileItems, null, 2)}</pre>
    </div>
  )
}

function MemoryItem({
  memoryFileItem,
  setMemoryFileItem,
  index,
  onRemove,
  bands,
}: {
  memoryFileItem: MemoryFileItem
  setMemoryFileItem: (item: MemoryFileItem) => void
  index: number
  onRemove: () => void
  bands: Band[]
}) {
  const fileUrl = memoryFileItem.file
    ? URL.createObjectURL(memoryFileItem.file)
    : getCloudflareImageUrl(memoryFileItem.cloudflare_file_id)
  const t = useTranslations('MultiFileInput')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(true)

  function formatSize(bytes: number) {
    if (bytes < 1024 ** 2) {
      return (bytes / 1024).toFixed(1) + ' KB'
    } else {
      return (bytes / 1024 ** 2).toFixed(1) + ' MB'
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      if (!videoRef.current.paused) {
        setIsPaused(false)
      }
    }
  }, [videoRef.current])

  function togglePlay() {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPaused(false)
      } else {
        videoRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  return (
    <div className="flex w-full gap-4 text-left text-sm">
      <div className="relative grid size-22 flex-none place-content-center rounded-md bg-slate-700">
        {memoryFileItem.file?.type.startsWith('image/') ? (
          <Image src={fileUrl} alt="" fill className="rounded-md object-contain" />
        ) : memoryFileItem.file?.type.startsWith('video/') ? (
          <>
            <video
              src={fileUrl}
              ref={videoRef}
              className="absolute inset-0 size-full rounded-md object-cover"
            />
            <Button
              label={t('play')}
              icon={
                isPaused ? <PlayIcon className="size-icon" /> : <PauseIcon className="size-icon" />
              }
              contentType="icon"
              size="small"
              appearance="secondary"
              onClick={togglePlay}
              className="relative"
            />
          </>
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid w-full">
        <div className="flex w-full gap-2">
          <div className="mb-2 grid w-full">
            <span className="truncate">{memoryFileItem.file?.name}</span>
            <div className="my-1 h-1 w-full rounded bg-slate-700">
              <div
                style={{ width: memoryFileItem.progress + '%' }}
                className={clsx(
                  'h-1 rounded transition-[width]',
                  memoryFileItem.error ? 'bg-red' : memoryFileItem.isSuccess ? 'bg-venom' : 'bg-blue'
                )}
              />
            </div>
            <div className="flex justify-between">
              {memoryFileItem.isLoading ? (
                <span className="text-blue">Uploading ... {memoryFileItem.progress.toFixed(2)} %</span>
              ) : memoryFileItem.isSuccess ? (
                <span className="text-venom">Uploaded</span>
              ) : null}
              <span className="text-slate-300">
                {memoryFileItem.file ? formatSize(memoryFileItem.file.size) : null}
              </span>
            </div>
          </div>
          <Button
            label={t('remove')}
            icon={<XIcon className="size-icon" />}
            contentType="icon"
            size="small"
            appearance="tertiary"
            danger
            onClick={onRemove}
            className="ml-auto"
          />
        </div>
        <div className="overflow-hidden">
              <SelectField
                label="Band"
                name="bandId"
                items={bands.map(band => ({ id: band.id, name: band.name }))}
                allItems={bands}
                value={memoryFileItem.bandId}
                onValueChange={bandId => setMemoryFileItem({ ...memoryFileItem, bandId })}
              />
        </div>
      </div>
    </div>
  )
}
