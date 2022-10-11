import Link from "next/link"
import { PencilSquareIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/solid"
import dayjs from 'dayjs'
import 'dayjs/locale/de'

export default function ConcertCard({ concert, bands, locations }) {
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'
  return (
    <div className="flex flex-col items-start gap-4 p-6 rounded-lg bg-slate-700 shadow">
      <div className="flex gap-4 w-full">
        <div className="inline-flex items-center">
          <CalendarIcon className="h-text mr-2" />
          {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
        </div>
        {concert.location && (
          <div className="inline-flex items-center">
            <MapPinIcon className="h-text mr-2" />
            {locations.find(location => location.id === concert.location)?.name}
          </div>
        )}
        <Link href={`/concerts/${concert.id}`} key={concert.id}>
          <a className="btn btn-link ml-auto"><PencilSquareIcon className="h-text" />Bearbeiten</a>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {concert.bands && concert.bands.map(concertBand => (
          <Link key={concertBand} href={`/bands/${concertBand}`}>
            <a className="btn btn-tag">
              {bands.find(band => band.id === concertBand).name}
            </a>
          </Link>
        ))}
      </div>
      {concert.description && <p className="text-slate-300">{concert.description}</p>}
    </div>
  )
}