import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Concert } from '../../types/types'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import clsx from 'clsx'
import useMediaQuery from '../../hooks/helpers/useMediaQuery'
import { UserItem } from '../shared/UserItem'
import { useState } from 'react'
import { ConcertDate } from './ConcertDate'
import { MapPin } from 'lucide-react'

interface ConcertCardProps {
  concert: Concert
}

export const ConcertCard = ({ concert }: ConcertCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: session } = useSession()
  const fanIds = new Set(concert?.bands_seen?.map(item => item.user_id))
  const { data: profiles } = useProfiles({ ids: [...fanIds] }, fanIds.size > 0)
  const router = useRouter()
  const bandsCount = concert.bands?.length || 0
  const bandsSeen = concert.bands_seen?.filter(item => item.user_id === session?.user.id)
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

  const visibleBandCount = generateVisibleBandCount(
    (isDesktop ? 40 : 20) * (concert.is_festival ? 2 : 1)
  )
  return (
    <div
      onClick={() => router.push(`/concerts/${concert.id}`)}
      className="group flex gap-4 rounded-2xl bg-slate-800 p-5 hover:cursor-pointer"
    >
      <div className="flex flex-col items-center">
        <ConcertDate date={new Date(concert.date_start)} isFirst />
        {concert.date_end && concert.date_end !== concert.date_start && (
          <>
            <div className="h-2 border-l border-slate-700 md:h-4" />
            <ConcertDate date={new Date(concert.date_end)} />
          </>
        )}
      </div>
      <div>
        {(concert.festival_root || concert.name) && (
          <div className={clsx("mb-2 w-fit rounded-md px-2 py-1 border-2 text-sm font-bold", concert.festival_root ? 'border-purple/50 text-purple' : 'border-blue/50 text-blue')}>
            {concert.festival_root ? concert.festival_root.name + ' ' + new Date(concert.date_start).getFullYear() :
              concert.name}
          </div>
        )}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {concert.bands &&
            concert.bands.slice(0, isExpanded ? undefined : visibleBandCount).map((band, index) => (
              <li role="presentation" className="flex gap-2" key={band.id}>
                <Link
                  href={`/bands/${band.id}`}
                  onClick={event => event.stopPropagation()}
                  className={clsx(
                    'font-bold hover:underline',
                    bandsSeen?.find(bandSeen => band.id === bandSeen.band_id) && 'text-venom'
                  )}
                >
                  {band.name}
                </Link>
                {index + 1 !== concert.bands?.length ? (
                  <span className="text-slate-300">&bull;</span>
                ) : null}
              </li>
            ))}
          {bandsCount > visibleBandCount && (
            <button
              onClick={event => {
                setIsExpanded(prev => !prev)
                event?.stopPropagation()
              }}
              className="rounded-md bg-slate-700 px-1.5 text-slate-300"
            >
              {isExpanded ? 'Weniger' : `+${bandsCount - visibleBandCount}`}
            </button>
          )}
        </div>
        <div className="mb-2 flex w-full gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-icon text-slate-300" />
            {concert.location?.name}
          </div>
        </div>
        {profiles && (
          <div className="flex flex-wrap gap-2 md:gap-x-4">
            {profiles.map(item => (
              <UserItem user={item} size="sm" usernameIsHidden={!isDesktop} key={item.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
