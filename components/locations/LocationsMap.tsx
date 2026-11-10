'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { getCountryName } from '@/lib/getCountryName'
import { LocationRecord } from '@/types/algolia'
import { MapPinIcon, XIcon } from 'lucide-react'
import { GeoJSONSource, setWorkerUrl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Map as MapGL,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  Source,
  type LayerProps,
} from 'react-map-gl/maplibre'
import mapMarker from '../../public/maps/map-marker.svg'
import { MapStyleControl, MapStyleName, mapStyles } from './MapStyleControl'

setWorkerUrl('https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl-worker.mjs')

const SOURCE_ID = 'locations'
const POINT_IMAGE_ID = 'location-marker'
const STEPS = [10, 25, 100]
const POINT_IMAGE_URL = mapMarker.src

function loadMapImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img')
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load map image: ${url}`))
    image.src = url
  })
}

export const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#6AF16E',
      STEPS[0],
      '#6FF1AC',
      STEPS[1],
      '#75F0E2',
      STEPS[2],
      '#75C8F0',
    ],
    'circle-stroke-width': 2,
    'circle-stroke-color': '#1F282E',
    'circle-radius': ['step', ['get', 'point_count'], 16, STEPS[0], 20, STEPS[1], 24, STEPS[2], 32],
  },
} satisfies LayerProps

export const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: SOURCE_ID,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Albert Sans', 'Albert Sans Fallback'],
    'text-size': ['step', ['get', 'point_count'], 14, STEPS[0], 15, STEPS[1], 16, STEPS[2], 20],
  },
  paint: {
    'text-color': '#1F282E',
  },
} satisfies LayerProps

export const pointLayer = {
  id: 'unclustered-point',
  type: 'symbol',
  source: SOURCE_ID,
  filter: ['!', ['has', 'point_count']],
  layout: {
    'icon-image': POINT_IMAGE_ID,
    'icon-anchor': 'bottom',
    'icon-size': 0.4,
    'icon-allow-overlap': true,
  },
} satisfies LayerProps

export function LocationsMap({
  locations,
}: {
  locations?: { data: LocationRecord[]; count: number | null }
}) {
  const mapRef = useRef<MapRef>(null)
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyleName>('streetsDark')
  const [popupInfo, setPopupInfo] = useState<LocationRecord | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const geojson = {
    type: 'FeatureCollection' as const,
    features:
      locations?.data
        .filter(location => location.latitude !== null && location.longitude !== null)
        .map(location => ({
          type: 'Feature' as const,
          properties: {
            id: location.id,
            name: location.name,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [location.longitude, location.latitude],
          },
        })) ?? [],
  }

  const onClick = async (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0]

    if (!feature || !mapRef.current) {
      return
    }

    if (feature.layer.id === clusterLayer.id) {
      const clusterId = feature.properties.cluster_id

      const geojsonSource: GeoJSONSource | undefined = mapRef.current.getSource(SOURCE_ID)

      const zoom = await geojsonSource?.getClusterExpansionZoom(clusterId)

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      })
    } else if (feature.layer.id === pointLayer.id) {
      const locationId = feature.properties.id
      const location = locations?.data.find(loc => loc.id === locationId)

      if (location) {
        setPopupInfo(location)
      }

      mapRef.current.easeTo({
        center: feature.geometry.coordinates,
        duration: 500,
      })
    }
  }

  return (
    <MapGL
      ref={mapRef}
      projection="globe"
      initialViewState={{
        latitude: 46.8,
        longitude: 8.2,
        zoom: isDesktop ? 6.5 : 6,
      }}
      onLoad={async event => {
        const map = event.target
        if (map.hasImage(POINT_IMAGE_ID)) return

        const image = await loadMapImage(POINT_IMAGE_URL)
        map.addImage(POINT_IMAGE_ID, image)
      }}
      interactiveLayerIds={[clusterLayer.id, pointLayer.id]}
      reuseMaps
      onClick={onClick}
      style={{ width: '100%', height: isDesktop ? 600 : 400, borderRadius: '1rem' }}
      mapStyle={mapStyles[currentMapStyle].url}
    >
      <FullscreenControl position="top-right" />
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" />
      <MapStyleControl
        position="top-left"
        currentMapStyle={currentMapStyle}
        switchStyle={styleName => setCurrentMapStyle(styleName)}
      />
      <Source
        id={SOURCE_ID}
        type="geojson"
        data={geojson}
        cluster
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...pointLayer} />
      </Source>
      {popupInfo && <LocationPopup location={popupInfo} onClose={() => setPopupInfo(null)} />}
    </MapGL>
  )
}

function LocationPopup({ location, onClose }: { location: LocationRecord; onClose: () => void }) {
  if (location.latitude === null || location.longitude === null) return null

  const imageUrl = location.image && getAssetUrl('ressources', location.image, location?.updated_at)
  const locale = useLocale()

  return (
    <div className="absolute inset-2 top-auto">
      <Link
        href={`/locations/${location.id}`}
        className="flex gap-4 rounded-lg bg-slate-800 p-4 text-base shadow-xl"
      >
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
          <div className="text-slate-300">
            {location.street && (
              <>
                {location.street}
                <br />
              </>
            )}
            {location.city}, {getCountryName(location.country_iso2, locale)}
          </div>
        </div>
      </Link>
      <button
        aria-label="Close"
        onClick={event => {
          event.stopPropagation()
          onClose()
        }}
        className="btn btn-secondary btn-icon btn-small absolute right-2 top-2"
      >
        <XIcon className="size-icon" />
      </button>
    </div>
  )
}
