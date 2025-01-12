'use client'

import Link from 'next/link'
import { Location, Profile } from '../../types/types'
import { UserItem } from '../shared/UserItem'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { useLocationProfiles } from '@/hooks/locations/useLocationProfiles'
import { getUniqueObjects } from '@/lib/getUniqueObjects'
import { ConcertItem } from '../concerts/ConcertItem'
import { Drawer, DrawerTitle, DrawerTrigger } from '../shared/Drawer'
import { useTranslations } from 'next-intl'

function LocationUserItem({
  location,
  profile,
  count,
}: {
  location: Location
  profile: Profile
  count: number
}) {
  const { data: bandsSeen } = useBandsSeen({
    userId: profile.id,
    locationId: location.id,
    bandsSize: 5,
  })
  const t = useTranslations('LocationCommunity')
  const concerts = getUniqueObjects(
    bandsSeen?.map(item => item.concert).filter(concert => !!concert) ?? []
  )

  return (
    <Drawer
      trigger={
        <DrawerTrigger className="group/user-item text-left">
          <UserItem user={profile} description={t('nConcerts', { count })} />
        </DrawerTrigger>
      }
    >
      <DrawerTitle className="sr-only">
        {t('uHasSeenNConcertsAtX', { username: profile.username, count, location: location.name })}
      </DrawerTitle>
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <UserItem user={profile} description={t('nConcerts', { count })} />
        <Link href={`/users/${profile.username}`} className="btn btn-secondary btn-small">
          {t('showProfile')}
        </Link>
      </div>
      <div className="relative -mb-6 overflow-y-auto pb-6 pt-4 md:pb-8">
        <ul className="grid">
          {concerts
            ?.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())
            .map(item => (
              <li key={item.id}>
                <ConcertItem concert={item} />
              </li>
            ))}
        </ul>
      </div>
    </Drawer>
  )
}

export function LocationCommunity({ location }: { location: Location }) {
  const { data: locationProfiles, status: locationProfilesStatus } = useLocationProfiles(
    location.id
  )
  const t = useTranslations('LocationCommunity')

  if (locationProfilesStatus === 'pending') {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  if (locationProfiles?.length === 0 || locationProfilesStatus === 'error') {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>{t('fans')}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {locationProfiles
          .filter(item => !!item.profile && !!item.count)
          .sort((a, b) => b.count! - a.count!)
          .map(item => (
            <LocationUserItem
              profile={item.profile!}
              count={item.count!}
              location={location}
              key={item.profile?.id}
            />
          ))}
      </div>
    </section>
  )
}
