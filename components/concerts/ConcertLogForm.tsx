import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useComments } from '@/hooks/concerts/useComments'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditLog } from '@/hooks/concerts/useEditLog'
import { useMemories } from '@/hooks/concerts/useMemories'
import { Tables } from '@/types/supabase'
import { Band, ListItem } from '@/types/types'
import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { FileIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import { Control, Controller, FieldError, useFieldArray, useForm } from 'react-hook-form'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { TextArea } from '../forms/TextArea'

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
  const { data: comments } = useComments({ concertId: concert?.id ?? null })
  const { register, control, handleSubmit, formState } = useForm<LogFields>({
    defaultValues: {
      bandsSeen: concert?.bands_seen?.map(bandSeen => bandSeen.band_id),
      memories: initialMemories,
      comment: comments?.[0]?.content || '',
    },
  })
  console.log(formState.errors)
  const initialBandsSeen = concert?.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')

  const addLog = useAddLog()
  const editLog = useEditLog()
  const t = useTranslations('ConcertLogForm')

  const isPending = addLog.isPending || editLog.isPending
  const isSuccess = addLog.isSuccess || editLog.isSuccess

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
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess])

  return (
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
        accept={['image/jpeg', 'image/webp'].join(',')}
        bands={concert?.bands || []}
      />
      <TextArea
        {...register('comment')}
        label={t('comment')}
        placeholder={t('commentPlaceholder')}
      />
      <div className="sticky bottom-0 z-10 mt-auto flex gap-4 bg-slate-800 py-4 md:static md:z-0 md:justify-end md:pb-0 [&>*]:flex-1">
        <Button type="submit" label={t('save')} appearance="primary" loading={isPending} />
        <Button onClick={close} label={t('cancel')} />
      </div>
    </form>
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
  error,
  accept,
  bands,
}: {
  label: string
  name: string
  control: Control<LogFields>
  error?: FieldError
  accept?: HTMLInputElement['accept']
  bands: Band[]
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'memories',
  })
  const ref = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const t = useTranslations('MultiFileInput')

  function handleDrag(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files)
      append(files.map(file => ({ file, band_id: null })))
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      append(files.map(file => ({ file, band_id: null })))
    }
  }

  return (
    <div className="grid">
      <label htmlFor={name}>
        <div className="mb-2 text-sm text-slate-300">{label}</div>
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="peer sr-only"
        />
        <div
          role="button"
          ref={ref}
          onDrag={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={clsx(
            'w-full cursor-pointer rounded-lg border-2 border-slate-500 bg-slate-750 p-6 text-center peer-focus:outline peer-focus:ring-2',
            !dragActive && 'border-dashed'
          )}
        >
          {fields.length > 0 ? (
            <div className="grid gap-4">
              {fields.map((field, index) => {
                return (
                  <MemoryItem
                    memory={field}
                    control={control}
                    index={index}
                    onRemove={() => {
                      remove(index)
                    }}
                    bands={bands}
                    key={field.id}
                  />
                )
              })}
            </div>
          ) : (
            <span className="text-center text-slate-300">
              {dragActive
                ? 'Dateien hier ablegen'
                : t.rich('dragOrBrowseFiles', {
                    span: chunk => (
                      <span className="cursor-pointer font-bold hover:text-venom">{chunk}</span>
                    ),
                  })}
            </span>
          )}
        </div>
      </label>
      {error && (
        <div className="text-red-600 shadow absolute z-10 mt-1 rounded bg-white px-2 py-1 text-sm">
          {error.message || 'Bitte wählen Sie eine Datei aus.'}
        </div>
      )}
    </div>
  )
}

function MemoryItem({
  memory,
  control,
  index,
  onRemove,
  bands,
}: {
  memory: Memory
  control: Control<LogFields>
  index: number
  onRemove: () => void
  bands: Band[]
}) {
  const fileUrl = 'file' in memory ? URL.createObjectURL(memory.file) : memory.file_url
  const t = useTranslations('MultiFileInput')

  function formatSize(bytes: number) {
    if (bytes < 1024 ** 2) {
      return (bytes / 1024).toFixed(1) + ' KB'
    } else {
      return (bytes / 1024 ** 2).toFixed(1) + ' MB'
    }
  }

  return (
    <div className="flex w-full gap-4 text-left text-sm">
      <div className="relative grid size-22 flex-none place-content-center rounded-md bg-slate-700">
        {fileUrl ? (
          <Image src={fileUrl} alt="" fill className="rounded-md object-cover" />
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid">
        <div className="flex w-full gap-2">
          <div className="mb-2 grid">
            <span className="truncate">
              {'file' in memory ? memory.file.name : memory.file_name}
            </span>
            <span className="text-slate-300">
              {formatSize('file' in memory ? memory.file.size : memory.file_size)}
            </span>
          </div>
          <Button
            label={t('remove')}
            icon={<XIcon className="size-icon" />}
            contentType="icon"
            size="small"
            appearance="tertiary"
            danger
            onClick={onRemove}
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
