import { Band } from '@/types/types'
import clsx from 'clsx'
import { FileIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Control, Controller, useFieldArray } from 'react-hook-form'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { MemoryFileItem, useMemoriesControl } from '@/hooks/helpers/useMemoriesControl'
import { LogFields } from './ConcertLogForm'

export function MemoriesControl({
  label,
  name,
  control,
  acceptedFileTypes,
  bands,
  concertId,
}: {
  label: string
  name: string
  control: Control<LogFields>
  acceptedFileTypes?: string[]
  bands: Band[]
  concertId: number | null
}) {
  const {
    fields: memoryFileItems,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: 'memories',
  })

  const { isDragActive, onDrag, onDrop, onChange } = useMemoriesControl({
    bucketName: 'concert-memories',
    folder: concertId?.toString(),
    acceptedFileTypes,
    memoryFileItems,
    append,
    update
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
        {memoryFileItems.map((fileItem, index) => {
          return (
            <MemoryItem
              fileItem={fileItem}
              control={control}
              index={index}
              onRemove={() => {
                remove(index)
              }}
              bands={bands}
              key={fileItem.file.name + index}
            />
          )
        })}
      </div>
      <pre className="max-w-xl overflow-auto">{JSON.stringify(memoryFileItems, null, 2)}</pre>
    </div>
  )
}

function MemoryItem({
  fileItem,
  control,
  index,
  onRemove,
  bands,
}: {
  fileItem: MemoryFileItem
  control: Control<LogFields>
  index: number
  onRemove: () => void
  bands: Band[]
}) {
  const fileUrl = URL.createObjectURL(fileItem.file)
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
        {fileItem.file.type.startsWith('image/') ? (
          <Image src={fileUrl} alt="" fill className="rounded-md object-contain" />
        ) : fileItem.file.type.startsWith('video/') ? (
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
            <span className="truncate">{fileItem.file.name}</span>
            <div className="my-1 h-1 w-full rounded bg-slate-700">
              <div
                style={{ width: fileItem.progress + '%' }}
                className={clsx(
                  'h-1 rounded transition-[width]',
                  fileItem.error ? 'bg-red' : fileItem.isSuccess ? 'bg-venom' : 'bg-blue'
                )}
              />
            </div>
            <div className="flex justify-between">
              {fileItem.isLoading ? (
                <span className="text-blue">Uploading ... {fileItem.progress.toFixed(2)} %</span>
              ) : fileItem.isSuccess ? (
                <span className="text-venom">Uploaded</span>
              ) : null}
              <span className="text-slate-300">{formatSize(fileItem.file.size)}</span>
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
          <Controller
            name={`memories.${index}.bandId`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Band"
                name="bandId"
                items={bands.map(band => ({ id: band.id, name: band.name }))}
                allItems={bands}
                value={value}
                onValueChange={onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}
