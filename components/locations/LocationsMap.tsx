'use client'

import { Map, Marker, NavigationControl } from 'react-map-gl/maplibre'
import { setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPinIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useLocations } from '@/hooks/locations/useLocations'
import { Location } from '@/types/types'
import { getAssetUrl } from '@/lib/getAssetUrl'
import Link from 'next/link'
import Image from 'next/image'
import { getCountryName } from '@/lib/getCountryName'
import { useLocale } from 'next-intl'

setWorkerUrl('https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl-worker.mjs')

export function LocationsMap() {
  const { data: locations } = useLocations()
  const [popupInfo, setPopupInfo] = useState<Location | null>(null)

  return (
    <Map
      initialViewState={{
        latitude: 46.8,
        longitude: 8.2,
        zoom: 6,
      }}
      style={{ width: '100%', height: 600, borderRadius: '1rem' }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      <NavigationControl position="top-right" />
      {locations?.data.map(location => {
        if (!location.latitude || !location.longitude) return null
        return (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={event => {
              event.originalEvent.stopPropagation()
              setPopupInfo(location)
            }}
          >
            <MapPinIcon className="h-6 w-6 text-venom" />
          </Marker>
        )
      })}
      {popupInfo && <LocationPopup location={popupInfo} onClose={() => setPopupInfo(null)} />}
    </Map>
  )
}

function LocationPopup({ location, onClose }: { location: Location; onClose: () => void }) {
  if (!location.latitude || !location.longitude) return null

  const imageUrl = location.image && getAssetUrl('ressources', location.image, location?.updated_at)
  const locale = useLocale()  

  return (
    <div className="text-base absolute inset-2 top-auto flex gap-4 rounded-lg bg-slate-800 p-4 shadow-xl">
      <div className="relative grid size-24 flex-none place-content-center rounded-lg bg-slate-750">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={location.name}
            fill
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <MapPinIcon className="size-6 text-slate-300" />
        )}
      </div>
      <div>
        <h2 className="h3 mb-0">{location.name}</h2>
        <div className="text-slate-300">{location.city}, {getCountryName(location.country_iso2, locale)}</div>
        <Link href={`/locations/${location.id}`}>Link zur Location</Link>{' '}
      </div>
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 text-slate-300"
      >
        <XIcon className="size-icon" />
      </button>
    </div>
  )
}
