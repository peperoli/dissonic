'use client'

import { TableRow } from '../TableRow'
import { Location } from '../../types/types'
import Image from 'next/image'
import { MapPinIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { getAssetUrl } from '@/lib/getAssetUrl'

export function LocationTableRow({ location }: { location: Location }) {
  const locale = useLocale()
  const imageUrl = getAssetUrl('ressources', location.image, location.updated_at)
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  return (
    <TableRow href={`/locations/${location.id}`}>
      <div className="relative flex size-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-750 md:size-12">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={location.name}
            fill
            sizes="150px"
            unoptimized
            className="rounded-lg object-cover"
          />
        ) : (
          <MapPinIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="md:hidden">
        <div className="line-clamp-1">{location.name}</div>
        <div className="line-clamp-1 text-sm text-slate-300">
          {location.city}, {location.country && regionNames.of(location.country.iso2)}
        </div>
      </div>
      <div className="hidden w-full items-center gap-4 md:flex">
        <div className="w-1/3">{location.name}</div>
        <div className="w-1/3 text-slate-300">{location.city}</div>
        {location.country && (
          <div className="w-1/3 text-slate-300">{regionNames.of(location.country.iso2)}</div>
        )}
      </div>
    </TableRow>
  )
}
