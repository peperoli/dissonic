import { Concert } from '@/types/types'
import { useSession } from '../../hooks/auth/useSession'
import Link from 'next/link'
import { Button } from '../Button'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { BadgeCheckIcon, BadgeMinusIcon, Edit, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useModal } from '../shared/ModalProvider'
import { Tooltip } from '../shared/Tooltip'

export function Lineup({ concert }: { concert: Concert }) {
  const { data: session } = useSession()
  const bandsSeen = concert.bands_seen
    ?.filter(item => item?.user_id === session?.user.id)
    .filter(item => typeof item !== 'undefined')
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Lineup')
  const hasBandsSeen = bandsSeen && bandsSeen.length > 0
  const isFutureConcert = new Date(concert.date_start) > new Date()
  const [_, setModal] = useModal()

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <div className="flex items-baseline gap-2">
        <h2>{t('lineup')}</h2>
        <span className="inline-flex gap-1 text-sm text-slate-300">
          &bull; {t('nBands', { count: concert.bands.length })}
          {session?.isMod &&
            (concert.resource_status === 'complete' ? (
              <Tooltip content={t('complete')} triggerOnClick>
                <BadgeCheckIcon className="size-icon text-venom" />
              </Tooltip>
            ) : concert.resource_status === 'incomplete_lineup' ? (
              <Tooltip content={t('incompleteLineup')} triggerOnClick>
                <BadgeMinusIcon className="size-icon text-yellow" />
              </Tooltip>
            ) : null)}
        </span>
      </div>
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
              session
                ? () => setModal(hasBandsSeen ? 'edit-log' : 'add-log')
                : () => push(`/login?redirect=${pathname}`)
            }
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
