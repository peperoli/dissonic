import { useEffect, useState } from 'react'
import { Concert } from '@/types/types'
import { useQueryClient } from '@tanstack/react-query'
import { useAddBandsSeen } from '../../hooks/bands/useAddBandsSeen'
import { useDeleteBandsSeen } from '../../hooks/bands/useDeleteBandsSeen'
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
import toast from 'react-hot-toast'

type BandListProps = {
  concert: Concert
  bandListHintPreference?: string
}

export function BandList({ concert, bandListHintPreference }: BandListProps) {
  const { data: session } = useSession()
  const bandsSeen = concert.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const [editing, setEditing] = useState(false)
  const [selectedBandsSeen, setSelectedBandsSeen] = useState<TablesInsert<'j_bands_seen'>[]>(
    bandsSeen ?? []
  )
  const addBandsSeen = useAddBandsSeen()
  const deleteBandsSeen = useDeleteBandsSeen()
  const isPending = addBandsSeen.isPending || deleteBandsSeen.isPending
  const isSuccess = addBandsSeen.isSuccess && deleteBandsSeen.isSuccess
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('BandList')
  const hasBandsSeen = bandsSeen && bandsSeen.length > 0
  const bandsSeenIds = bandsSeen?.map(bandSeen => bandSeen?.band_id)
  const selectedBandsSeenIds = selectedBandsSeen.map(bandSeen => bandSeen.band_id)
  const bandsToAdd = selectedBandsSeen.filter(item => !bandsSeenIds?.includes(item.band_id))
  const bandsToDelete = bandsSeen?.filter(
    item => !selectedBandsSeenIds.includes(item?.band_id ?? 0)
  )
  const isFutureConcert = new Date(concert.date_start) > new Date()

  async function updateBandsSeen() {
    addBandsSeen.mutate(bandsToAdd)
    deleteBandsSeen.mutate(bandsToDelete ?? [])
  }

  useEffect(() => {
    setSelectedBandsSeen(bandsSeen ?? [])
  }, [editing])

  useEffect(() => {
    if (isSuccess) {
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['concert', concert.id] })
      toast.success(t('bandsSeenUpdated'))
    }
  }, [isSuccess])
  return (
    <section>
      {editing ? (
        <>
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
          <div className="flex flex-wrap gap-2">
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
        </>
      ) : (
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
      )}
      {!concert.is_archived && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {editing ? (
            <>
              <Button
                onClick={updateBandsSeen}
                label={t('save')}
                appearance="primary"
                loading={isPending}
              />
              <Button onClick={() => setEditing(false)} label={t('cancel')} />
            </>
          ) : (
            <>
              <Button
                onClick={
                  session ? () => setEditing(true) : () => push(`/login?redirect=${pathname}`)
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
            </>
          )}
        </div>
      )}
    </section>
  )
}
