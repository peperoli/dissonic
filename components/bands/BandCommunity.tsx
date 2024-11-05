'use client'

import Link from 'next/link'
import { Band, Profile } from '../../types/types'
import { UserItem } from '../shared/UserItem'
import { useBandProfiles } from '@/hooks/bands/useBandProfiles'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { ConcertItem } from '../concerts/ConcertItem'
import { Drawer, DrawerTitle, DrawerTrigger } from '../shared/Drawer'

function BandUserItem({ band, profile, count }: { band: Band; profile: Profile; count: number }) {
  const { data: bandsSeen } = useBandsSeen({ userId: profile.id, bandId: band.id })
  const concerts = bandsSeen?.map(item => item.concert).filter(concert => !!concert)

  return (
    <Drawer
      trigger={
        <DrawerTrigger className="group/user-item text-left">
          <UserItem user={profile} description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`} />
        </DrawerTrigger>
      }
    >
      <DrawerTitle className="sr-only">
        {profile.username} hat {count} Konzert(e) mit {band.name} gesehen
      </DrawerTitle>
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <UserItem user={profile} description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`} />
        <Link href={`/users/${profile.username}`} className="btn btn-secondary btn-small">
          Profil anzeigen
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

export function BandCommunity({ band }: { band: Band }) {
  const { data: bandProfiles, status: bandProfilesStatus } = useBandProfiles(band.id)

  if (bandProfilesStatus === 'pending') {
    return <p>Lade ...</p>
  }

  if (bandProfiles?.length === 0 || bandProfilesStatus === 'error') {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>Fans</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {bandProfiles
          .filter(item => !!item.profile)
          .sort((a, b) => b.count - a.count)
          .map(item => (
            <BandUserItem
              profile={item.profile!}
              count={item.count}
              band={band}
              key={item.profile?.id}
            />
          ))}
      </div>
    </section>
  )
}
