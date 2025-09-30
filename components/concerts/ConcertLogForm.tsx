import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useComments } from '@/hooks/concerts/useComments'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditLog } from '@/hooks/concerts/useEditLog'
import { useMemories } from '@/hooks/concerts/useMemories'
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
import { MemoriesControl } from './MemoriesControl'
import { MemoryFileItem } from '@/hooks/helpers/useMemoriesControl'

export type LogFields = {
  bandsSeen: number[]
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
      comment: comments?.[0]?.content || '',
    },
  })
  const [memoryFileItems, setMemoryFileItems] = useState<MemoryFileItem[]>(
    initialMemories?.map(memory => ({
      id: memory.id,
      file: { type: memory.file_type },
      fileId: memory.file_id,
      bandId: memory.band_id,
      duration: memory.duration,
      preview: null,
      isSuccess: true,
    })) ?? []
  )
  const initialBandsSeen = concert?.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const addLog = useAddLog()
  const editLog = useEditLog()
  const t = useTranslations('ConcertLogForm')
  const isPending = addLog.isPending || editLog.isPending
  const isSuccess = addLog.isSuccess || editLog.isSuccess

  function onSubmit(formData: LogFields) {
    const { bandsSeen, comment } = formData
    const initialBandsSeenIds = initialBandsSeen?.map(item => item?.band_id)
    const bandsToAdd = bandsSeen.filter(item => !initialBandsSeenIds?.includes(item))
    const bandsToDelete = initialBandsSeenIds?.filter(item => !bandsSeen.includes(item)) ?? []
    const initialMemoryIds = initialMemories?.map(memory => memory.id) ?? []
    const memoryIds = memoryFileItems.map(memoryFileItem => memoryFileItem.id)
    const memoryFileItemsToAdd = memoryFileItems.filter(memoryFileItem => !memoryFileItem.id)
    const memoryIdsToDelete =
      initialMemories
        ?.map(memory => memory.id)
        .filter(initialMemoryId => !memoryIds.includes(initialMemoryId)) ?? []
    const memoriesToUpdate = memoryFileItems
      .filter(memoryFileItem => memoryFileItem.id != undefined)
      .filter(memoryFileItem => initialMemoryIds.includes(memoryFileItem.id!))
      .map(memoryFileItem => ({
        id: memoryFileItem.id!,
        band_id: memoryFileItem.bandId,
      }))

    if (!session || !concert) {
      return
    }

    if (isNew) {
      addLog.mutate({
        concertId: concert.id,
        userId: session.user.id,
        bandsToAdd,
        memoryFileItemsToAdd,
        comment,
      })
    } else {
      editLog.mutate({
        concertId: concert?.id,
        userId: session.user.id,
        bandsToAdd,
        bandsToDelete,
        memoryFileItemsToAdd,
        memoryIdsToDelete,
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
          name="memoryFileItems"
          fileItems={memoryFileItems}
          setFileItems={setMemoryFileItems}
          label={t('memories')}
          acceptedFileTypes={['image/*', 'video/*']}
          bands={concert?.bands || []}
        />
        <TextArea
          {...register('comment')}
          label={t('comment')}
          placeholder={t('commentPlaceholder')}
        />
        <div className="sticky bottom-0 z-10 mt-auto flex gap-4 bg-slate-800 py-4 md:static md:z-0 md:justify-end md:pb-0 [&>*]:flex-1">
          <Button onClick={close} label={t('cancel')} />
          <Button type="submit" label={t('save')} appearance="primary" loading={isPending} />
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
