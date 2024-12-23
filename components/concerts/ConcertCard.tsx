import { Concert } from '../../types/types'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import clsx from 'clsx'
import { UserItem } from '../shared/UserItem'
import { Fragment } from 'react'
import { CalendarIcon } from 'lucide-react'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { TruncatedList } from 'react-truncate-list'

interface ConcertCardProps {
  concert: Concert
  nested?: boolean
}

export const ConcertCard = ({ concert, nested }: ConcertCardProps) => {
  const fanIds = new Set(concert?.bands_seen?.map(item => item?.user_id ?? ''))
  const { data: profiles } = useProfiles({ ids: [...fanIds] }, fanIds.size > 0)
  const { data: session } = useSession()
  const { data: spotifyArtist } = useSpotifyArtist(concert.bands[0]?.spotify_artist_id)
  const bandsSeen = concert.bands_seen?.filter(item => item?.user_id === session?.user.id)
  const picture = spotifyArtist?.images?.[2]
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : null
  const t = useTranslations('ConcertCard')
  const locale = useLocale()

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
            unoptimized
            width={150}
            height={150}
            className="size-22 rounded-lg object-cover"
          />
        ) : (
          <CalendarIcon className="size-8 text-slate-300" />
        )}
      </div>
      <div className="grid content-start">
        {concert.festival_root && (
          <p className="mb-0 w-fit truncate rounded-md bg-white px-1 text-sm font-bold text-slate-850">
            {concert.festival_root.name} {dateStart.getFullYear()}
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
        {dateEnd ? (
          <p className="text-sm">
            {t('dateStartToDateEnd', {
              dateStart: dateStart.toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
              dateEnd: dateEnd.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            })}
          </p>
        ) : (
          <p className="text-sm">
            {dateStart.toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        {!concert.festival_root && (
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
