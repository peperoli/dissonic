import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useComments } from '@/hooks/concerts/useComments'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditLog } from '@/hooks/concerts/useEditLog'
import { useMemories } from '@/hooks/concerts/useMemories'
import { Tables } from '@/types/supabase'
import { Band, ListItem } from '@/types/types'
import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { FileIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Control, Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { TextArea } from '../forms/TextArea'
import { getR2ImageUrl } from '@/lib/r2Helpers'
import { FileItem, useMemoriesControl } from '@/hooks/helpers/useMemoriesControl'
import { progress } from 'framer-motion'
import { getImageUploadUrl } from '@/actions/files'
import { useQuery } from '@tanstack/react-query'

export type Memory =
  | Tables<'memories'>
  | {
      file: File
      band_id: number | null
    }

export type LogFields = {
  bandsSeen: number[]
  memories: Memory[]
  comment: string
}

export function ConcertLogForm({ isNew, close }: { isNew?: boolean; close: () => void }) {
  const { id: concertId } = useParams<{ id?: string }>()
  const { data: concert } = useConcert(concertId ? parseInt(concertId) : null)
  const { data: session } = useSession()
  const { data: initialMemories } = useMemories({ concertId: concert?.id })
  const { data: comments } = useComments({
    concertId: concert?.id ?? null,
    userId: session?.user.id,
    includeReplies: false,
  })
  const { register, control, handleSubmit } = useForm<LogFields>({
    values: {
      bandsSeen:
        concert?.bands_seen
          ?.filter(bandSeen => bandSeen.user_id === session?.user.id)
          .map(bandSeen => bandSeen.band_id) ?? [],
      memories: initialMemories ?? [],
      comment: comments?.[0]?.content || '',
    },
  })
  const initialBandsSeen = concert?.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const addLog = useAddLog()
  const editLog = useEditLog()
  const t = useTranslations('ConcertLogForm')
  const [uploadProgress, setUploadProgress] = useState(0)
  const isPending = addLog.isPending || editLog.isPending
  const isSuccess = addLog.isSuccess || editLog.isSuccess

  const { data: uploadUrlData } = useQuery({
    queryKey: ['direct-upload-url'],
    queryFn: async () => {
      return await getImageUploadUrl()
    },
  })

  function onSubmit(formData: LogFields) {
    const { bandsSeen, memories, comment } = formData
    const initialBandsSeenIds = initialBandsSeen?.map(item => item?.band_id)
    const bandsToAdd = bandsSeen.filter(item => !initialBandsSeenIds?.includes(item))
    const bandsToDelete = initialBandsSeenIds?.filter(item => !bandsSeen.includes(item)) ?? []
    const memoriesIds = memories.filter(memory => 'id' in memory).map(memory => memory.id)
    const memoriesToAdd = memories.filter(memory => 'file' in memory)
    const memoriesToDelete =
      initialMemories?.filter(initialMemory => !memoriesIds.includes(initialMemory.id)) ?? []
    const memoriesToUpdate = memories
      .filter(memory => 'id' in memory)
      .filter(memory => initialMemories?.some(initialMemory => initialMemory.id === memory.id))

    if (!session || !concert) {
      return
    }

    if (isNew) {
      addLog.mutate({
        concertId: concert.id,
        userId: session.user.id,
        bandsToAdd,
        memoriesToAdd,
        comment,
      })
    } else {
      editLog.mutate({
        concertId: concert?.id,
        userId: session.user.id,
        bandsToAdd,
        bandsToDelete,
        memoriesToAdd,
        memoriesToDelete,
        memoriesToUpdate,
        comment,
        onUploadProgress: progress => {
          if (progress) {
            setUploadProgress(progress)
          }
        },
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <p className="text-slate-300">{t('hintText')}</p>
        <fieldset>
          <legend className="mb-2 text-sm text-slate-300">{t('bandsIveSeen')}</legend>
          <Controller
            name="bandsSeen"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ToggleGroup
                name="bandsSeen"
                values={value}
                onValuesChange={onChange}
                items={concert?.bands ?? []}
              />
            )}
          />
        </fieldset>
        <MemoriesControl
          name="memories"
          control={control}
          label={t('memories')}
          acceptedFileTypes={['image/*', 'video/*']}
          bands={concert?.bands || []}
          concertId={concert?.id}
        />
        <TextArea
          {...register('comment')}
          label={t('comment')}
          placeholder={t('commentPlaceholder')}
        />
        <div className="sticky bottom-0 z-10 mt-auto flex gap-4 bg-slate-800 py-4 md:static md:z-0 md:justify-end md:pb-0 [&>*]:flex-1">
          <Button onClick={close} label={t('cancel')} />
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? t('saving') : t('save')}
            {uploadProgress > 0 && (
              <span className="ml-2 text-sm text-slate-300">
                ({Math.round(uploadProgress * 100)}%)
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

function ToggleGroup({
  name,
  items,
  values,
  onValuesChange,
}: {
  name: string
  items: ListItem[]
  values: number[]
  onValuesChange: (values: number[]) => void
}) {
  function handleChange(id: number) {
    if (values.includes(id)) {
      onValuesChange(values.filter(item => item !== id))
    } else {
      onValuesChange([...values, id])
    }
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(item => {
        const isChecked = values.includes(item.id)
        return (
          <li key={item.id}>
            <Checkbox.Root
              name={name}
              value={item.name}
              checked={isChecked}
              onCheckedChange={() => handleChange(item.id)}
              className={clsx('btn btn-tag', isChecked && 'btn-seen')}
            >
              {item.name}
            </Checkbox.Root>
          </li>
        )
      })}
    </ul>
  )
}

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
  concertId: number
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'memories',
  })
  const { fileItems, setFileItems, isDragActive, onDrag, onDrop, onChange } = useMemoriesControl({
    bucketName: 'concert-memories',
    folder: concertId.toString(),
    acceptedFileTypes,
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
        {fileItems.map((fileItem, index) => {
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
      <pre className="max-w-xl overflow-auto">{JSON.stringify(fileItems, null, 2)}</pre>
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
  fileItem: FileItem
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
            name={`memories.${index}.band_id`}
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
