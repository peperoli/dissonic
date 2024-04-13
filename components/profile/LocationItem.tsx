import { ItemCount } from '@/lib/getCounts'
import { Location } from '@/types/types'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

type LocationItemProps = {
  topItem: ItemCount & Location
}

export const LocationItem = ({ topItem }: LocationItemProps) => {
  return (
    <Link href={`/locations/${topItem.id}`} className="block">
      <div className="relative flex aspect-square flex-shrink-0 items-center justify-center rounded-2xl bg-slate-750">
        <MapPin className="size-8 text-slate-300" />
      </div>
      <div className="mt-2 overflow-hidden">
        <h3 className="mb-0 truncate whitespace-nowrap text-base">{topItem.name}</h3>
        <div className="text-slate-300 text-sm">{topItem.count} Konzerte</div>
      </div>
    </Link>
  )
}
