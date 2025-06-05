import { useState } from 'react'
import { Concert } from '@/types/types'
import { useSession } from '../../hooks/auth/useSession'
import Link from 'next/link'
import { Button } from '../Button'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Edit, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ConcertLogForm } from './ConcertLogForm'
import { useModal } from '../shared/ModalProvider'

export function Lineup({
  concert,
  bandListHintPreference,
}: {
  concert: Concert
  bandListHintPreference: string
}) {
  const { data: session } = useSession()
  const bandsSeen = concert.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('BandList')
  const hasBandsSeen = bandsSeen && bandsSeen.length > 0
  const isFutureConcert = new Date(concert.date_start) > new Date()
  const [modal, setModal] = useModal()

  return (
    <section>
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
            onClick={session ? () => setModal('add-log') : () => push(`/login?redirect=${pathname}`)}
            label={t('iWasThere')}
            icon={hasBandsSeen ? <Edit className="size-icon" /> : <Plus className="size-icon" />}
            appearance={hasBandsSeen ? 'secondary' : 'primary'}
            size={hasBandsSeen ? 'small' : 'medium'}
            disabled={isFutureConcert}
          />
          {isFutureConcert && (
            <p className="text-sm text-slate-300">{t('thisConcertIsInTheFuture')}</p>
          )}
        </div>
      )}
    </section>
  )
}
