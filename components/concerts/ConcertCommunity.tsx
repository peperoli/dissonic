'use client'

import Link from 'next/link'
import { Band, Concert, Profile, SpotifyArtist } from '../../types/types'
import { UserItem } from '../shared/UserItem'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { GuitarIcon } from 'lucide-react'
import { useConcertProfiles } from '@/hooks/concerts/useConcertProfiles'
import { Drawer, DrawerTitle, DrawerTrigger } from '../shared/Drawer'
import { useLocale, useTranslations } from 'next-intl'
import { getConcertName } from '@/lib/getConcertName'

function BandItem({ band }: { band: Band }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id, {
    enabled: !band.spotify_artist_images,
  })
  const locale = useLocale()
  const image =
    (band.spotify_artist_images as SpotifyArtist['images'])?.[2] || spotifyArtist?.images?.[2]
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  return (
    <Link
      href={`/bands/${band.id}`}
      className="flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700"
    >
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        {image ? (
          <Image
            src={image.url}
            alt={band.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <GuitarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div className="truncate">{band.name}</div>
        {band.country?.iso2 && (
          <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
      </div>
    </Link>
  )
}

function ConcertUserItem({
  concert,
  profile,
  count,
}: {
  concert: Concert
  profile: Profile
  count: number
}) {
  const t = useTranslations('ConcertCommunity')
  const locale = useLocale()
  const bandsSeenIds = concert.bands_seen
    ?.filter(item => item.user_id === profile.id)
    .map(item => item.band_id)
  const bands = concert.bands?.filter(item => bandsSeenIds?.includes(item.id))

  return (
    <Drawer
      trigger={
        <DrawerTrigger className="group/user-item text-left">
          <UserItem user={profile} description={t('nBands', { count })} />
        </DrawerTrigger>
      }
    >
      <div className="sr-only mb-4 mt-8 flex items-start justify-between gap-4">
        <DrawerTitle className="mb-0">
          {t('uHasSeenNBandsAtConcertX', {
            username: profile.username,
            count,
            concert: getConcertName(concert, locale),
          })}
        </DrawerTitle>
      </div>
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <UserItem user={profile} description={t('nBands', { count })} />
        <Link href={`/users/${profile.username}`} className="btn btn-secondary btn-small">
          {t('showProfile')}
        </Link>
      </div>
      <div className="relative -mb-6 overflow-y-auto pb-6 pt-4 md:-mb-8 md:pb-8">
        <ul className="grid">
          {bands
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map(item => (
              <li key={item.id}>
                <BandItem band={item} />
              </li>
            ))}
        </ul>
      </div>
    </Drawer>
  )
}

export function ConcertCommunity({ concert }: { concert: Concert }) {
  const { data: concertProfiles, status: concertProfilesStatus } = useConcertProfiles(concert.id)
  const t = useTranslations('ConcertCommunity')

  if (concertProfilesStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (concertProfiles?.length === 0 || concertProfilesStatus === 'error') {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>{t('fans')}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {concertProfiles
          .filter(item => !!item.profile)
          .sort((a, b) => b.count - a.count)
          .map(item => (
            <ConcertUserItem
              profile={item.profile!}
              count={item.count}
              concert={concert}
              key={item.profile?.id}
            />
          ))}
      </div>
    </section>
  )
}
