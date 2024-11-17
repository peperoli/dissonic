import { Concert } from '../../types/types'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import clsx from 'clsx'
import useMediaQuery from '../../hooks/helpers/useMediaQuery'
import { UserItem } from '../shared/UserItem'
import { MouseEvent, useState } from 'react'
import { ConcertDate } from './ConcertDate'
import { MapPin } from 'lucide-react'
import { Chip } from '../Chip'
import { TruncatedList } from 'react-truncate-list'
import { useRouter } from 'next/navigation'

interface ConcertCardProps {
  concert: Concert
  nested?: boolean
}

export const ConcertCard = ({ concert, nested }: ConcertCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: session } = useSession()
  const fanIds = new Set(concert?.bands_seen?.map(item => item?.user_id ?? ''))
  const { data: profiles } = useProfiles({ ids: [...fanIds] }, fanIds.size > 0)
  const bandsSeen = concert.bands_seen?.filter(item => item?.user_id === session?.user.id)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  function expand(event: MouseEvent) {
    event.stopPropagation()
    setIsExpanded(true)
  }

  return (
    <div
      onClick={() => router.push(`/concerts/${concert.id}`)}
      className={clsx(
        'group flex gap-4 rounded-2xl p-5 hover:cursor-pointer',
        nested ? 'bg-slate-750' : 'bg-slate-800'
      )}
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
      <div className="w-full">
        {(concert.festival_root || concert.name) && (
          <div className="mb-2">
            <Chip
              label={
                concert.festival_root
                  ? concert.festival_root.name + ' ' + new Date(concert.date_start).getFullYear()
                  : (concert.name ?? '')
              }
              size="sm"
              color={concert.festival_root ? 'purple' : 'blue'}
            />
          </div>
        )}
        <TruncatedList
          renderTruncator={({ hiddenItemsCount }) => (
            <button
              onClick={expand}
              className="rounded-md bg-slate-700 px-1.5 font-bold text-slate-300 hover:bg-slate-600"
            >{`+${hiddenItemsCount}`}</button>
          )}
          className={clsx(
            'mb-2 flex w-full flex-wrap items-center gap-x-2 gap-y-1',
            !isExpanded && (concert.is_festival ? 'max-h-13' : 'max-h-6')
          )}
        >
          {concert.bands?.map((band, index) => (
            <div className="flex gap-2" key={band.id}>
              <div
                className={clsx(
                  'font-bold',
                  bandsSeen?.find(bandSeen => band.id === bandSeen?.band_id) && 'text-venom'
                )}
              >
                {band.name}
              </div>
              {index + 1 !== concert.bands?.length && (
                <span className="text-slate-300">&bull;</span>
              )}
            </div>
          ))}
        </TruncatedList>
        <div className="mb-2 flex w-full gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-icon text-slate-300" />
            {concert.location?.name}
          </div>
        </div>
        {profiles && (
          <div className="flex max-h-6 w-full items-center gap-2 md:gap-x-4">
            {profiles.slice(0, 3).map(item => (
              <UserItem user={item} size="sm" usernameIsHidden={!isDesktop} key={item.id} />
            ))}
            {profiles.length > 3 && (
              <span className="text-sm text-slate-300">+{profiles.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
