'use client'

import { useSession } from '@/hooks/auth/useSession'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { Tooltip } from '../shared/Tooltip'
import { UserItem } from '../shared/UserItem'
import { useProfile } from '@/hooks/profiles/useProfile'
import { Profile } from '@/types/types'
import { Tables } from '@/types/supabase'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { CalendarIcon, GuitarIcon, MapPinIcon } from 'lucide-react'

export function ComparisonChart({
  user1,
  user2,
  user1BandsSeen,
  user2BandsSeen,
  resourceType,
  size = 'md',
}: {
  user1: Profile
  user2: Profile
  user1BandsSeen: (Tables<'j_bands_seen'> & {
    concert: Tables<'concerts'> | null
    band: Tables<'bands'> | null
  })[]
  user2BandsSeen: (Tables<'j_bands_seen'> & {
    concert: Tables<'concerts'> | null
    band: Tables<'bands'> | null
  })[]
  resourceType: 'concerts' | 'bands' | 'locations'
  size?: 'sm' | 'md'
}) {
  const user1ConcertsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.concert_id))
  const user2ConcertsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.concert_id))
  const user1UniqueBandsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.band_id))
  const user2UniqueBandsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.band_id))
  const user1LocationsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.concert?.location_id))
  const user2LocationsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.concert?.location_id))
  const onlyUser1 =
    resourceType === 'concerts'
      ? user1ConcertsSeen.difference(user2ConcertsSeen)
      : resourceType === 'bands'
        ? user1UniqueBandsSeen.difference(user2UniqueBandsSeen)
        : user1LocationsSeen.difference(user2LocationsSeen)
  const onlyUser2 =
    resourceType === 'concerts'
      ? user2ConcertsSeen.difference(user1ConcertsSeen)
      : resourceType === 'bands'
        ? user2UniqueBandsSeen.difference(user1UniqueBandsSeen)
        : user2LocationsSeen.difference(user1LocationsSeen)
  const shared =
    resourceType === 'concerts'
      ? user1ConcertsSeen.intersection(user2ConcertsSeen)
      : resourceType === 'bands'
        ? user1UniqueBandsSeen.intersection(user2UniqueBandsSeen)
        : user1LocationsSeen.intersection(user2LocationsSeen)
  const total = onlyUser1.union(onlyUser2).union(shared)
  const t = useTranslations('ComparisonChart')

  return (
    <div className="flex items-center gap-2">
      {size !== 'sm' && (
        <div className="grid size-8 flex-none place-content-center rounded-full bg-slate-700 text-sm">
          {resourceType === 'concerts' ? (
            <CalendarIcon className="size-icon" />
          ) : resourceType === 'bands' ? (
            <GuitarIcon className="size-icon" />
          ) : (
            <MapPinIcon className="size-icon" />
          )}
        </div>
      )}
      <div className="flex w-full items-center gap-1">
        <Tooltip
          triggerOnClick
          content={
            <>
              <strong>
                {t(`count_${resourceType}`, {
                  count: onlyUser1.size,
                })}
              </strong>
              <br />
              {t('onlyUsername', { username: user1.username })}
            </>
          }
        >
          <div
            className={clsx(
              'rounded-md',
              resourceType === 'concerts'
                ? 'bg-venom/40'
                : resourceType === 'bands'
                  ? 'bg-blue/40'
                  : 'bg-purple/40',
              size === 'sm' ? 'h-2' : 'h-6'
            )}
            style={{ width: `${(onlyUser1.size / total.size) * 100}%` }}
          />
        </Tooltip>
        <Tooltip
          triggerOnClick
          content={
            <>
              <strong>{t(`count_${resourceType}`, { count: shared.size })}</strong>
              <br />
              {t('shared')}
            </>
          }
        >
          <div
            className={clsx(
              'rounded-md',
              resourceType === 'concerts'
                ? 'bg-venom shadow-shine shadow-venom/50'
                : resourceType === 'bands'
                  ? 'bg-blue shadow-shine shadow-blue/50'
                  : 'bg-purple shadow-shine shadow-purple/50',
              size === 'sm' ? 'h-2' : 'h-6'
            )}
            style={{ width: `${(shared.size / total.size) * 100}%` }}
          />
        </Tooltip>
        <Tooltip
          triggerOnClick
          content={
            <>
              <strong>
                {t(`count_${resourceType}`, {
                  count: onlyUser2.size,
                })}
              </strong>
              <br />
              {t('onlyUsername', { username: user2.username })}
            </>
          }
        >
          <div
            className={clsx(
              'rounded-md',
              resourceType === 'concerts'
                ? 'bg-venom/40'
                : resourceType === 'bands'
                  ? 'bg-blue/40'
                  : 'bg-purple/40',
              size === 'sm' ? 'h-2' : 'h-6'
            )}
            style={{ width: `${(onlyUser2.size / total.size) * 100}%` }}
          />
        </Tooltip>
      </div>
      {size !== 'sm' && (
        <div className="grid size-8 flex-none place-content-center rounded-full bg-slate-700 text-sm">
          {resourceType === 'concerts' ? (
            <CalendarIcon className="size-icon" />
          ) : resourceType === 'bands' ? (
            <GuitarIcon className="size-icon" />
          ) : (
            <MapPinIcon className="size-icon" />
          )}
        </div>
      )}
    </div>
  )
}

export function Comparison({ profileId }: { profileId: string }) {
  const { data: session } = useSession()
  const { data: sessionProfile } = useProfile(session?.user.id ?? null)
  const { data: profile } = useProfile(profileId)
  const { data: bandsSeen1 } = useBandsSeen({ userId: session?.user.id })
  const { data: bandsSeen2 } = useBandsSeen({ userId: profileId })
  const t = useTranslations('Comparison')

  if (!sessionProfile || !profile || !bandsSeen1 || !bandsSeen2) {
    return <p className="text-sm text-slate-300">{t('loading')}</p>
  }

  return (
    <section className="grid gap-4 rounded-lg bg-slate-800 p-6">
      <h2 className="mb-0">{t('profileComparison')}</h2>
      <div className="flex items-center gap-2">
        <UserItem user={sessionProfile} usernameIsHidden />
        <span className="section-headline w-full">vs</span>
        <UserItem user={profile} usernameIsHidden />
      </div>
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        resourceType="concerts"
      />
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        resourceType="bands"
      />
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        resourceType="locations"
      />
    </section>
  )
}
