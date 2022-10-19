import Link from "next/link"
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from "@heroicons/react/24/solid"
import dayjs from 'dayjs'
import 'dayjs/locale/de'

export default function ConcertCard({ concert, bands, bandsSeen, locations }) {
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'
  return (
    <div className="p-6 rounded-lg bg-slate-700 shadow">
      {concert.name && <h2 className="mb-0">{concert.name}</h2>}
      <div className="flex gap-4 w-full mb-2">
        <div className="inline-flex items-center">
          <CalendarIcon className="h-text mr-2" />
          {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
          {concert.date_end && <span>&nbsp;&ndash; {dayjs(concert.date_end).locale('de-ch').format(dateFormat)}</span>}
        </div>
        {concert.location && (
          <div className="inline-flex items-center">
            <MapPinIcon className="h-text mr-2" />
            {locations.find(location => location.id === concert.location)?.name}
          </div>
        )}
        <Link href={`/concerts/${concert.id}`} key={concert.id}>
          <a className="btn btn-link ml-auto"><ArrowRightIcon className="h-text" />Mehr anzeigen</a>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {concert.band_ids && concert.band_ids.map(concertBand => (
          <Link key={concertBand} href={`/bands/${concertBand}`}>
            <a className={`btn btn-tag${bandsSeen?.band_ids && bandsSeen.band_ids.some(bandSeen => bandSeen === concertBand) ? ' btn-seen' : ''}`}>
              {bands.find(band => band.id === concertBand)?.name}
            </a>
          </Link>
        ))}
      </div>
      {concert.description && <p className="text-slate-300">{concert.description}</p>}
    </div>
  )
}