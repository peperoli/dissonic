import { FormEvent, useEffect, useState } from 'react'
import { Concert } from '@/types/types'
import { BandSeenToggle } from './BandSeenToggle'
import { useSession } from '../../hooks/auth/useSession'
import Link from 'next/link'
import { Button } from '../Button'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Edit, Lightbulb, Plus, X } from 'lucide-react'
import { TablesInsert } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import { setBandListHintPreference } from '@/actions/preferences'
import { useForm } from 'react-hook-form'
import { MultiFileInput } from '../forms/MultiFileInput'
import { useAddLog } from '@/hooks/concerts/useAddLog'
import { useMemories } from '@/hooks/concerts/useMemories'

type BandListProps = {
  concert: Concert
  bandListHintPreference: string
}

export function BandList({ concert, bandListHintPreference }: BandListProps) {
  const { data: session } = useSession()
  const bandsSeen = concert.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const [isEditing, setIsEditing] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('BandList')
  const hasBandsSeen = bandsSeen && bandsSeen.length > 0
  const isFutureConcert = new Date(concert.date_start) > new Date()

  return (
    <section>
      {isEditing ? (
        <ConcertLogForm
          concert={concert}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          bandListHintPreference={bandListHintPreference}
        />
      ) : (
        <>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {concert.bands?.map((band, index) => (
              <li role="presentation" className="flex gap-2" key={band.id}>
                <Link
                  href={`/bands/${band.id}`}
                  className={clsx(
                    'font-bold hover:underline',
                    bandsSeen?.find(bandSeen => band.id === bandSeen?.band_id) && 'text-venom'
                  )}
                >
                  {band.name}
                </Link>
                {index + 1 !== concert.bands?.length ? (
                  <span className="text-slate-300">&bull;</span>
                ) : null}
              </li>
            ))}
          </ul>
          {!concert.is_archived && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                onClick={
                  session ? () => setIsEditing(true) : () => push(`/login?redirect=${pathname}`)
                }
                label={t('iWasThere')}
                icon={
                  hasBandsSeen ? <Edit className="size-icon" /> : <Plus className="size-icon" />
                }
                appearance={hasBandsSeen ? 'secondary' : 'primary'}
                size={hasBandsSeen ? 'small' : 'medium'}
                disabled={isFutureConcert}
              />
              {isFutureConcert && (
                <p className="text-sm text-slate-300">{t('thisConcertIsInTheFuture')}</p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ConcertLogForm({
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
  const [memories, setMemories] = useState<{ file: File; bandId: number | null }[]>(
    initialMemories?.map(memory => ({ file: memory.file_name, bandId: memory.band_id })) || []
  )
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
      memories,
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
      <MultiFileInput
        name="memories"
        label={t('memories') + ' (optional)'}
        accept={['image/jpeg', 'image/webp'].join(',')}
        value={memories}
        onChange={setMemories}
        bands={concert.bands || []}
      />
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" label={t('save')} appearance="primary" loading={addLog.isPending} />
        <Button onClick={() => setIsEditing(false)} label={t('cancel')} />
      </div>
    </form>
  )
}
