import { FormEvent, useEffect, useState } from 'react'
import { Concert } from '@/types/types'
import { BandSeenToggle } from './BandSeenToggle'
import { useSession } from '../../hooks/auth/useSession'
import { Button } from '../Button'
import { Lightbulb, X } from 'lucide-react'
import { TablesInsert } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import { setBandListHintPreference } from '@/actions/preferences'
import { useForm } from 'react-hook-form'
import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useMemories } from '@/hooks/concerts/useMemories'
import { MemoriesControl, Memory } from '../forms/MemoriesControl'

export function ConcertLogForm({
  concert,
  isEditing,
  setIsEditing,
  bandListHintPreference,
}: {
  concert: Concert
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  bandListHintPreference: string
}) {
  const { data: session } = useSession()
  const {} = useForm({ defaultValues: {} })
  const { data: initialMemories } = useMemories({ concertId: concert.id })
  const [memories, setMemories] = useState<Memory[]>(initialMemories || [])
  const bandsSeen = concert.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const [selectedBandsSeen, setSelectedBandsSeen] = useState<TablesInsert<'j_bands_seen'>[]>(
    bandsSeen ?? []
  )
  const addLog = useAddLog()
  const t = useTranslations('ConcertLogForm')
  const bandsSeenIds = bandsSeen?.map(bandSeen => bandSeen?.band_id)
  const selectedBandsSeenIds = selectedBandsSeen.map(bandSeen => bandSeen.band_id)
  const bandsToAdd = selectedBandsSeen.filter(item => !bandsSeenIds?.includes(item.band_id))
  const bandsToDelete =
    bandsSeen?.filter(item => !selectedBandsSeenIds.includes(item?.band_id ?? 0)) ?? []

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!session) {
      return
    }

    addLog.mutate({
      concertId: concert.id,
      userId: session.user.id,
      bandsToAdd,
      bandsToDelete,
      memoriesToAdd: memories.filter(memory => 'file' in memory),
      memoriesToDelete:
        initialMemories?.filter(
          initialMemory =>
            !memories.some(memory => 'id' in memory && memory.id === initialMemory.id)
        ) ?? [],
      memoriesToUpdate:
        initialMemories?.filter(initialMemory =>
          memories.some(memory => 'id' in memory && memory.id === initialMemory.id)
        ) ?? [],
    })
  }

  useEffect(() => {
    setSelectedBandsSeen(bandsSeen ?? [])
  }, [isEditing])

  useEffect(() => {
    if (addLog.isSuccess) {
      setIsEditing(false)
    }
  }, [addLog.isSuccess])

  return (
    <form onSubmit={handleSubmit}>
      {bandListHintPreference !== 'hide' && (
        <div className="mb-4 flex w-full gap-3 rounded-lg bg-slate-700 p-4">
          <Lightbulb className="size-icon flex-none text-yellow" />
          <p>{t('chooseBandsYouHaveSeenAtThisConcert')}</p>
          <button
            onClick={async () => await setBandListHintPreference('hide')}
            aria-label={t('hideHint')}
            className="ml-auto grid h-6 w-6 flex-none place-content-center rounded-md hover:bg-slate-600"
          >
            <X className="size-icon" />
          </button>
        </div>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        {concert.bands?.map(band => (
          <BandSeenToggle
            key={band.id}
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
        bands={concert.bands || []}
      />
      <pre className="overflow-auto">{JSON.stringify(memories, null, 2)}</pre>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" label={t('save')} appearance="primary" loading={addLog.isPending} />
        <Button onClick={() => setIsEditing(false)} label={t('cancel')} />
      </div>
    </form>
  )
}