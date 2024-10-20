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
import { UserItem } from '../shared/UserItem'
import { useLocation } from '@/hooks/locations/useLocation'
import { useLocationProfiles } from '@/hooks/locations/useLocationProfiles'
import { MetaInfo } from '../shared/MetaInfo'
import { SpeedDial } from '../layout/SpeedDial'

type LocationPageProps = {
  location: Location
  locationQueryState?: string
}

export const LocationPage = ({
  location: initialLocation,
  locationQueryState,
}: LocationPageProps) => {
  const { data: location, isPending: locationIsLoading } = useLocation(
    initialLocation.id,
    initialLocation
  )
  const { data: locationProfiles } = useLocationProfiles(initialLocation.id)
  const { data: concerts } = useConcerts(undefined, {
    locations: [initialLocation.id],
    sort: { sort_by: 'date_start', sort_asc: false },
  })
  const [_, setModal] = useModal()
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })
  const mapSearchQuery = encodeURIComponent(
    [location?.name, location?.zip_code, location?.city].join(' ')
  )

  if (locationIsLoading) {
    return <p>Lade...</p>
  }

  if (!location) notFound()
  return (
    <main className="container grid gap-4">
      <div className="flex items-center justify-between">
        <Link href={`/locations${locationQueryState ?? ''}`} className="btn btn-small btn-tertiary">
          <ArrowLeft className="size-icon" />
          Zurück zur Übersicht
        </Link>
        <div className="flex gap-3">
          <Button
            onClick={
              session ? () => setModal('edit-location') : () => push(`/login?redirect=${pathname}`)
            }
            label="Bearbeiten"
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
            label="Löschen"
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
          <h1>{location.name}</h1>
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
                Website
              </Link>
            )}
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`}
              target="_blank"
              className="btn btn-small btn-secondary"
            >
              Maps
            </Link>
          </div>
        </div>
      </header>
      {locationProfiles && locationProfiles.length > 0 && (
        <section className="rounded-lg bg-slate-800 p-4 md:p-6">
          <h2>Community</h2>
          <div className="flex flex-wrap gap-4">
            {locationProfiles
              .sort((a, b) => (a.count && b.count ? b.count - a.count : 0))
              .map((item, index) => (
                <Link
                  href={`/users/${item.profile?.username}`}
                  className="group/user-item"
                  key={index}
                >
                  {item.profile && (
                    <UserItem
                      user={item.profile}
                      description={`${item.count} Konzert${item.count && item.count > 1 ? 'e' : ''}`}
                    />
                  )}
                </Link>
              ))}
          </div>
        </section>
      )}
      {concerts?.data && concerts?.data?.length > 0 && (
        <section className="grid gap-4 rounded-lg bg-slate-800 p-4 md:p-6">
          <h2 className="mb-0">Konzerte @ {location.name}</h2>
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
