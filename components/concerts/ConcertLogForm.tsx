import { FormEvent, useEffect, useState, useTransition } from 'react'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { Lightbulb, X } from 'lucide-react'
import { TablesInsert } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import { setLineupHintPreference } from '@/actions/preferences'
import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useMemories } from '@/hooks/concerts/useMemories'
import { MemoriesControl, Memory } from '../forms/MemoriesControl'
import { useParams } from 'next/navigation'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useCookies } from 'contexts/cookies'
import { User } from '@supabase/supabase-js'
import { Dispatch, SetStateAction } from 'react'
import { Tables } from '@/types/supabase'
import clsx from 'clsx'
import { useEditLog } from '@/hooks/concerts/useEditLog'

export function ConcertLogForm({ isNew, close }: { isNew?: boolean; close: () => void }) {
  const { id: concertId } = useParams<{ id?: string }>()
  const { data: concert } = useConcert(concertId ? parseInt(concertId) : null)
  const { data: session } = useSession()
  const { data: initialMemories } = useMemories({ concertId: concert?.id })
  const [memories, setMemories] = useState<Memory[]>(initialMemories || [])
  const bandsSeen = concert?.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const [selectedBandsSeen, setSelectedBandsSeen] = useState<TablesInsert<'j_bands_seen'>[]>(
    bandsSeen ?? []
  )
  const addLog = useAddLog()
  const editLog = useEditLog()
  const t = useTranslations('ConcertLogForm')
  const { lineupHintPreference } = useCookies()
  const bandsSeenIds = bandsSeen?.map(bandSeen => bandSeen?.band_id)
  const selectedBandsSeenIds = selectedBandsSeen.map(bandSeen => bandSeen.band_id)
  const bandsToAdd = selectedBandsSeen.filter(item => !bandsSeenIds?.includes(item.band_id))
  const bandsToDelete =
    bandsSeen?.filter(item => !selectedBandsSeenIds.includes(item?.band_id ?? 0)) ?? []
  const memoriesIds = memories.filter(memory => 'id' in memory).map(memory => memory.id)
  const memoriesToAdd = memories.filter(memory => 'file' in memory)
  const memoriesToDelete =
    initialMemories?.filter(initialMemory => !memoriesIds.includes(initialMemory.id)) ?? []
  const memoriesToUpdate = memories
    .filter(memory => 'id' in memory)
    .filter(memory => initialMemories?.some(initialMemory => initialMemory.id === memory.id))
  const isPending = addLog.isPending || editLog.isPending
  const isSuccess = addLog.isSuccess || editLog.isSuccess

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!session || !concert) {
      return
    }

    if (isNew) {
      addLog.mutate({
        concertId: concert.id,
        bandsToAdd,
        memoriesToAdd,
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
      })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess])

  return (
    <form onSubmit={handleSubmit}>
      {lineupHintPreference !== 'hide' && <Hint />}
      <div className="mb-4 flex flex-wrap gap-2">
        {concert?.bands?.map(band => (
          <BandSeenToggle
            key={band.id}
            concertId={concert.id}
            user={session?.user || null}
            band={band}
            selectedBandsSeen={selectedBandsSeen}
            setSelectedBandsSeen={setSelectedBandsSeen}
          />
        ))}
      </div>
      <MemoriesControl
        name="memories"
        label={t('memories') + ' (optional)'}
        accept={['image/jpeg', 'image/webp'].join(',')}
        value={memories}
        onChange={setMemories}
        bands={concert?.bands || []}
      />
      <pre className="overflow-auto">{JSON.stringify(memories, null, 2)}</pre>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" label={t('save')} appearance="primary" loading={isPending} />
        <Button onClick={close} label={t('cancel')} />
      </div>
    </form>
  )
}

function Hint() {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('ConcertLogForm')

  return (
    <div className="mb-4 flex w-full items-center gap-3 rounded-lg bg-slate-700 p-4">
      <Lightbulb className="size-icon flex-none text-yellow" />
      <p>{t('chooseBandsYouHaveSeenAtThisConcert')}</p>
      <Button
        label={t('hideHint')}
        onClick={() =>
          startTransition(async () => {
            await setLineupHintPreference('hide')
          })
        }
        icon={<X className="size-icon" />}
        contentType="icon"
        appearance="tertiary"
        size="small"
        loading={isPending}
        className="ml-auto hover:!bg-slate-600"
      />
    </div>
  )
}

function BandSeenToggle({
  concertId,
  band,
  selectedBandsSeen,
  setSelectedBandsSeen,
  user,
}: {
  concertId: number
  band: Tables<'bands'>
  selectedBandsSeen: TablesInsert<'j_bands_seen'>[]
  setSelectedBandsSeen: Dispatch<SetStateAction<TablesInsert<'j_bands_seen'>[]>>
  user: User | null
}) {
  const isSeen =
    selectedBandsSeen &&
    selectedBandsSeen.some(item => item.band_id === band.id && item.user_id === user?.id)
      ? true
      : false

  function handleChange() {
    if (!user) return
    if (isSeen) {
      setSelectedBandsSeen(selectedBandsSeen.filter(item => item.band_id !== band.id))
    } else {
      setSelectedBandsSeen([
        ...selectedBandsSeen,
        {
          concert_id: concertId,
          user_id: user?.id,
          band_id: band.id,
        },
      ])
    }
  }

  if (!user) {
    return <p className="btn btn-tag pointer-events-none">{band.name}</p>
  }

  return (
    <label className={clsx('btn btn-tag focus-within:outline', isSeen && 'btn-seen')}>
      <input
        type="checkbox"
        name="seenBands"
        value={`seenBand${band.id}`}
        checked={isSeen}
        onChange={handleChange}
        className="sr-only"
      />
      {band.name}
    </label>
  )
}
