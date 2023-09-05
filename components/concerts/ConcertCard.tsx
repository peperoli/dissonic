import Link from 'next/link'
import { MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import { Concert } from '../../types/types'
import { useProfiles } from '../../hooks/useProfiles'
import { useSession } from '../../hooks/useSession'
import clsx from 'clsx'
import useMediaQuery from '../../hooks/useMediaQuery'

type ConcertDateProps = {
  date: Date
  display?: 'roomy' | 'compact'
}

const ConcertDate = ({ date, display = 'compact' }: ConcertDateProps) => {
  return (
    <div
      className={clsx(
        'relative flex-none flex justify-center items-center w-20 border border-slate-700 rounded-lg first:bg-slate-700 first:group-hover:bg-slate-600 shadow-md transition duration-200',
        clsx(display === 'roomy' && 'flex-col h-20', display === 'compact' && 'gap-1 h-12')
      )}
    >
      <span className={clsx('font-bold', display === 'roomy' && 'text-3xl')}>
        {date.toLocaleDateString('de-CH', { day: 'numeric' })}
      </span>
      <span className="text-sm">{date.toLocaleDateString('de-CH', { month: 'short' })}</span>
      {date?.getFullYear() !== new Date().getFullYear() && (
        <span className="absolute -bottom-3 px-2 py-1 rounded-full text-xs font-bold text-slate-850 bg-blue-300">
          {date.getFullYear()}
        </span>
      )}
    </div>
  )
}

interface ConcertCardProps {
  concert: Concert
  display?: 'roomy' | 'compact'
}

export const ConcertCard = ({ concert, display = 'compact' }: ConcertCardProps) => {
  const { data: session } = useSession()
  const fanIds = new Set(concert?.bands_seen?.map(item => item.user_id))
  const { data: profiles } = useProfiles({ ids: [...fanIds] })
  const router = useRouter()
  const bandsCount = concert.bands?.length || 0
  const isDesktop = useMediaQuery('(min-width: 768px)')

  function generateVisibleBandCount(threshold: number) {
    let charCount = concert.bands?.[0]?.name.length || 0
    let index = 1

    for (index; index < bandsCount; index++) {
      charCount += concert.bands?.[index]?.name.length || 0
      if (charCount > threshold) {
        break
      }
    }

    return index
  }

  const visibleBandCount = generateVisibleBandCount(isDesktop ? 40 : 24)
  return (
    <div
      onClick={() => router.push(`/concerts/${concert.id}`)}
      className={clsx(
        'flex flex-col md:flex-row group gap-4 rounded-2xl bg-slate-800 hover:cursor-pointer',
        display === 'roomy' && 'p-6',
        display === 'compact' && 'p-4'
      )}
    >
      <div className="flex md:flex-col items-center">
        <ConcertDate date={new Date(concert.date_start)} display={display} />
        {concert.date_end && concert.date_end !== concert.date_start && (
          <>
            <div className="w-4 md:w-auto md:h-4 border-t md:border-l border-slate-700" />
            <ConcertDate date={new Date(concert.date_end)} display={display} />
          </>
        )}
      </div>
      <div>
        {concert.name && (
          <div className="w-fit mb-2 px-3 py-1 rounded-full font-bold text-sm text-slate-850 bg-purple">
            {concert.name}
          </div>
        )}
        <div className="flex flex-wrap items-center -ml-2 mb-2">
          {concert.bands &&
            concert.bands
              .slice(0, display === 'compact' ? visibleBandCount : undefined)
              .map((band, index) => (
                <Fragment key={band.id}>
                  {index !== 0 ? <span className="text-slate-300">&bull;</span> : null}
                  <Link
                    href={`/bands/${band.id}`}
                    onClick={event => event.stopPropagation()}
                    className={`btn btn-link${
                      concert.bands_seen?.find(
                        item => item.band_id === band.id && item.user_id === session?.user.id
                      )
                        ? ' !text-venom'
                        : ''
                    }`}
                  >
                    {band.name}
                  </Link>
                </Fragment>
              ))}
          {display === 'compact' && bandsCount > visibleBandCount && (
            <div className="px-1.5 rounded-md text-slate-300 bg-slate-700">
              +{bandsCount - visibleBandCount}
            </div>
          )}
        </div>
        <div className="flex gap-4 w-full mb-2">
          {concert.location && (
            <div className="inline-flex items-center text-sm">
              <MapPinIcon className="h-icon mr-2 text-slate-300" />
              {concert.location?.name}
            </div>
          )}
        </div>
        {profiles && (
          <div className="flex text-sm">
            <UsersIcon className="flex-none h-icon mr-2 self-center text-slate-300" />
            <div className="-ml-2">
              {profiles.map(item => (
                <Link
                  key={item?.id}
                  href={`/users/${item?.username}`}
                  onClick={event => event.stopPropagation()}
                  className="btn btn-link"
                >
                  {item?.username}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
