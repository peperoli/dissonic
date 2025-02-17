import Link from 'next/link'
import { Location } from '../../types/types'
import { MapPinIcon } from 'lucide-react'
import { getAssetUrl } from '@/lib/getAssetUrl'
import Image from 'next/image'

export function LocationItem({ location }: { location: Location }) {
  const imageUrl = getAssetUrl('ressources', location.image, location.updated_at)

  return (
    <Link
      href={`/locations/${location.id}`}
      className="flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700"
    >
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        {imageUrl ? (
          <Image src={imageUrl} alt={location.name} fill unoptimized className="rounded-lg object-cover" />
        ) : (
          <MapPinIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="grid">
        <div className="truncate">{location.name}</div>
        <div className="text-sm text-slate-300">{location.city}</div>
      </div>
    </Link>
  )
}
