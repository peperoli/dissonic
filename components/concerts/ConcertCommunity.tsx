'use client'

import Link from 'next/link'
import { Concert, Profile } from '../../types/types'
import { UserItem } from '../shared/UserItem'
import { useConcertProfiles } from '@/hooks/concerts/useConcertProfiles'
import { Drawer, DrawerTitle, DrawerTrigger } from '../shared/Drawer'
import { useLocale, useTranslations } from 'next-intl'
import { getConcertName } from '@/lib/getConcertName'
import { BandItem } from '../bands/BandItem'

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
        <Link href={`/users/${encodeURIComponent(profile.username)}`} className="btn btn-secondary btn-small">
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
