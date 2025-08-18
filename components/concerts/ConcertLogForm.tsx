import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useComments } from '@/hooks/concerts/useComments'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditLog } from '@/hooks/concerts/useEditLog'
import { useMemories } from '@/hooks/concerts/useMemories'
import { Tables } from '@/types/supabase'
import { ListItem } from '@/types/types'
import * as Checkbox from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { TextArea } from '../forms/TextArea'
import { getImageUploadUrl } from '@/actions/files'
import { useQuery } from '@tanstack/react-query'
import { MemoriesControl } from './MemoriesControl'
import { MemoryFileItem } from '@/hooks/helpers/useMemoriesControl'

export type LogFields = {
  bandsSeen: number[]
  memories: MemoryFileItem[]
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
      memories:
        initialMemories?.map(memory => ({
          ...memory,
          bandId: memory.band_id,
          fileName: '',
          preview: '',
          isLoading: false,
          progress: 100,
          isSuccess: true,
          error: null,
        })) ?? [],
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
          concertId={concert?.id ?? null}
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
