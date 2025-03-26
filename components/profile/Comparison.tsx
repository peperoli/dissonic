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

function ComparisonChart({
  user1,
  user2,
  user1BandsSeen,
  user2BandsSeen,
  ressourceType,
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
  ressourceType: 'concerts' | 'bands' | 'locations'
}) {
  const user1ConcertsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.concert_id))
  const user2ConcertsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.concert_id))
  const user1UniqueBandsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.band_id))
  const user2UniqueBandsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.band_id))
  const user1LocationsSeen = new Set(user1BandsSeen.map(bandSeen => bandSeen.concert?.location_id))
  const user2LocationsSeen = new Set(user2BandsSeen.map(bandSeen => bandSeen.concert?.location_id))
  const onlyUser1 =
    ressourceType === 'concerts'
      ? user1ConcertsSeen.difference(user2ConcertsSeen)
      : ressourceType === 'bands'
        ? user1UniqueBandsSeen.difference(user2UniqueBandsSeen)
        : user1LocationsSeen.difference(user2LocationsSeen)
  const onlyUser2 =
    ressourceType === 'concerts'
      ? user2ConcertsSeen.difference(user1ConcertsSeen)
      : ressourceType === 'bands'
        ? user2UniqueBandsSeen.difference(user1UniqueBandsSeen)
        : user2LocationsSeen.difference(user1LocationsSeen)
  const shared =
    ressourceType === 'concerts'
      ? user1ConcertsSeen.intersection(user2ConcertsSeen)
      : ressourceType === 'bands'
        ? user1UniqueBandsSeen.intersection(user2UniqueBandsSeen)
        : user1LocationsSeen.intersection(user2LocationsSeen)
  const total = onlyUser1.union(onlyUser2).union(shared)
  // const t = useTranslations('ComparisonChart')

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <UserItem user={user1} usernameIsHidden />
        <div className="absolute inset-0 grid place-content-center rounded-full bg-slate-900/20">
          {ressourceType === 'concerts' ? (
            <CalendarIcon className="size-icon drop-shadow" />
          ) : ressourceType === 'bands' ? (
            <GuitarIcon className="size-icon drop-shadow" />
          ) : (
            <MapPinIcon className="size-icon drop-shadow" />
          )}
        </div>
      </div>
      <div className="flex w-full items-center gap-1">
        <Tooltip
          triggerOnClick
          content={`Nur ${user1.username}: ${onlyUser1.size} ${ressourceType}`}
        >
          <div
            className={clsx(
              'h-4 rounded bg-slate-300',
              ressourceType === 'concerts'
                ? 'bg-venom/40'
                : ressourceType === 'bands'
                  ? 'bg-blue/40'
                  : 'bg-purple/40'
            )}
            style={{ width: `${(onlyUser1.size / total.size) * 100}%` }}
          />
        </Tooltip>
        <Tooltip triggerOnClick content={`Gemeinsam: ${shared.size} ${ressourceType}`}>
          <div
            className={clsx(
              'h-4 rounded',
              ressourceType === 'concerts'
                ? 'bg-venom shadow-shine shadow-venom/50'
                : ressourceType === 'bands'
                  ? 'bg-blue shadow-shine shadow-blue/50'
                  : 'bg-purple shadow-shine shadow-purple/50'
            )}
            style={{ width: `${(shared.size / total.size) * 100}%` }}
          />
        </Tooltip>
        <Tooltip
          triggerOnClick
          content={`Nur ${user2.username}: ${onlyUser2.size} ${ressourceType}`}
        >
          <div
            className={clsx(
              'h-4 rounded bg-slate-300',
              ressourceType === 'concerts'
                ? 'bg-venom/40'
                : ressourceType === 'bands'
                  ? 'bg-blue/40'
                  : 'bg-purple/40'
            )}
            style={{ width: `${(onlyUser2.size / total.size) * 100}%` }}
          />
        </Tooltip>
      </div>
      <div className="relative">
        <UserItem user={user2} usernameIsHidden />
        <div className="absolute inset-0 grid place-content-center rounded-full bg-slate-900/20">
          {ressourceType === 'concerts' ? (
            <CalendarIcon className="size-icon drop-shadow" />
          ) : ressourceType === 'bands' ? (
            <GuitarIcon className="size-icon drop-shadow" />
          ) : (
            <MapPinIcon className="size-icon drop-shadow" />
          )}
        </div>
      </div>{' '}
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
      <h2>{t('profileComparison')}</h2>
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        ressourceType="concerts"
      />
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        ressourceType="bands"
      />
      <ComparisonChart
        user1={sessionProfile}
        user2={profile}
        user1BandsSeen={bandsSeen1}
        user2BandsSeen={bandsSeen2}
        ressourceType="locations"
      />
    </section>
  )
}
