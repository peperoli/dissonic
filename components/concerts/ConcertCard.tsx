import { Concert, SpotifyArtist } from '../../types/types'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import clsx from 'clsx'
import { UserItem } from '../shared/UserItem'
import { Fragment } from 'react'
import { CalendarIcon } from 'lucide-react'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import Link from 'next/link'
import { TruncatedList } from 'react-truncate-list'
import { ConcertDate } from './ConcertDate'

interface ConcertCardProps {
  concert: Concert
  nested?: boolean
}

export const ConcertCard = ({ concert, nested }: ConcertCardProps) => {
  const fanIds = new Set(concert?.bands_seen?.map(item => item?.user_id ?? ''))
  const { data: profiles } = useProfiles({ ids: [...fanIds] }, fanIds.size > 0)
  const { data: session } = useSession()
  const { data: spotifyArtist } = useSpotifyArtist(concert.bands[0]?.spotify_artist_id, {
    enabled: !concert.bands[0]?.spotify_artist_images,
  })
  const bandsSeen = concert.bands_seen?.filter(item => item?.user_id === session?.user.id)
  const picture =
    (concert.bands[0]?.spotify_artist_images as SpotifyArtist['images'])?.[2] ||
    spotifyArtist?.images?.[2]
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : null

  return (
    <Link
      href={`/concerts/${concert.id}`}
      className={clsx(
        'group flex gap-4 rounded-2xl p-4 hover:cursor-pointer',
        nested ? 'bg-slate-750' : 'bg-slate-800'
      )}
    >
      <div className="grid size-22 flex-none place-content-center rounded-lg bg-slate-700">
        {picture ? (
          <Image
            src={picture.url}
            alt={concert.bands[0].name}
            width={150}
            height={150}
            unoptimized
            className="size-22 rounded-lg object-cover"
          />
        ) : (
          <CalendarIcon className="size-8 text-slate-300" />
        )}
      </div>
      <div className="grid content-start">
        {concert.festival_root && (
          <p className="line-clamp-1 text-sm font-bold">
            <span className="justify-self-start rounded-md bg-white px-1 text-slate-850">
              {concert.festival_root.name} {dateStart.getFullYear()}
            </span>
            <span className="text-slate-300">&nbsp;&bull; {concert.location?.city}</span>
          </p>
        )}
        {concert.name && (
          <p className="truncate text-sm font-bold">
            {concert.name}
            <span className="truncate text-sm text-slate-300">
              &nbsp;&bull; {concert.location?.name}, {concert.location?.city}
            </span>
          </p>
        )}
        <p className="h2 mb-0 truncate">
          {concert.bands?.map((band, index) => (
            <Fragment key={band.id}>
              {index !== 0 && <span className="text-slate-300"> &bull; </span>}
              <span
                className={clsx(
                  bandsSeen?.find(bandSeen => band.id === bandSeen?.band_id) && 'text-venom'
                )}
              >
                {band.name}
              </span>
            </Fragment>
          ))}
        </p>
        <ConcertDate dateStart={dateStart} dateEnd={dateEnd} />
        {!concert.festival_root && !concert.name && (
          <p className="truncate text-sm text-slate-300">
            {concert.location?.name}, {concert.location?.city}
          </p>
        )}
        {profiles && (
          <TruncatedList
            renderTruncator={({ hiddenItemsCount }) => (
              <span className="text-sm text-slate-300">+{hiddenItemsCount}</span>
            )}
            className="mt-1 flex w-full items-center gap-2"
          >
            {profiles.map(item => (
              <UserItem user={item} size="sm" usernameIsHidden key={item.id} />
            ))}
          </TruncatedList>
        )}
      </div>
    </Link>
  )
}
