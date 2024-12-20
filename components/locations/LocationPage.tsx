'use client'

import Link from 'next/link'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Location } from '../../types/types'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { useModal } from '../shared/ModalProvider'
import { ArrowLeft, Edit, MapPin, Trash } from 'lucide-react'
import { useLocation } from '@/hooks/locations/useLocation'
import { MetaInfo } from '../shared/MetaInfo'
import { SpeedDial } from '../layout/SpeedDial'
import { LocationCommunity } from './LocationCommunity'
import { useLocale, useTranslations } from 'next-intl'
import clsx from 'clsx'

type LocationPageProps = {
  location: Location
  locationQueryState?: string
}

export const LocationPage = ({
  location: initialLocation,
  locationQueryState,
}: LocationPageProps) => {
  const { data: location } = useLocation(initialLocation.id, initialLocation)
  const { data: concerts } = useConcerts({
    locations: [initialLocation.id],
    sort: { sort_by: 'date_start', sort_asc: false },
  })
  const [_, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('LocationPage')
  const locale = useLocale()
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  const mapSearchQuery = encodeURIComponent(
    [location?.name, location?.zip_code, location?.city].join(' ')
  )

  if (!location) {
    notFound()
  }

  return (
    <main className="container grid gap-4">
      <div className="flex items-center justify-between">
        <Link href={`/locations${locationQueryState ?? ''}`} className="btn btn-small btn-tertiary">
          <ArrowLeft className="size-icon" />
          {t('locations')}
        </Link>
        <div className="flex gap-3">
          <Button
            onClick={
              session ? () => setModal('edit-location') : () => push(`/login?redirect=${pathname}`)
            }
            label={t('edit')}
            icon={<Edit className="size-icon" />}
            contentType="icon"
            size="small"
            appearance="tertiary"
          />
          <Button
            onClick={
              session
                ? () => setModal('delete-location')
                : () => push(`/login?redirect=${pathname}`)
            }
            label={t('delete')}
            icon={<Trash className="size-icon" />}
            contentType="icon"
            danger
            size="small"
            appearance="tertiary"
          />
        </div>
      </div>
      <header className="flex flex-col gap-5 rounded-2xl bg-radial-gradient from-blue/20 p-6 md:flex-row">
        <div className="relative grid aspect-square w-full flex-none place-content-center rounded-lg bg-slate-750 md:w-40">
          <MapPin className="size-12 text-slate-300" />
        </div>
        <div>
          <h1 className={clsx(location.alt_names && 'mb-0')}>{location.name}</h1>
          {location.alt_names && (
            <p className="mb-6 text-sm text-slate-300">
              {t('altNames')}: {location.alt_names}
            </p>
          )}
          {location.city && (
            <div className="mb-5 flex items-center gap-4">
              <MapPin className="size-icon flex-none text-slate-300" />
              {location.city}
              {location.country && <>, {regionNames.of(location.country.iso2)}</>}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {location.website && (
              <Link href={location.website} target="_blank" className="btn btn-small btn-secondary">
                {t('website')}
              </Link>
            )}
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
              target="_blank"
              className="btn btn-small btn-secondary"
            >
              Google Maps
            </Link>
          </div>
        </div>
      </header>
      <LocationCommunity location={location} />
      {concerts?.data && concerts.data.length > 0 && (
        <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:p-6">
          <h2 className="mb-0">
            {t('nConcertsAtX', { count: concerts.data.length, location: location.name })}
          </h2>
          {concerts?.data.map(item => <ConcertCard key={item.id} concert={item} nested />)}
        </section>
      )}
      <MetaInfo
        createdAt={location.created_at}
        creator={location.creator}
        ressourceType="locations"
        ressourceId={location.id}
      />
      <SpeedDial />
    </main>
  )
}
