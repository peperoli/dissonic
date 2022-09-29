import Link from "next/link"
import { PencilSquareIcon, CalendarIcon } from "@heroicons/react/24/solid"
import dayjs from 'dayjs'
import 'dayjs/locale/de'

export default function ConcertCard({ concert, bands, concertBands }) {
  const selectedConcertBands = concertBands.filter(concertBand => concertBand.concert_id === concert.id)
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'
  return (
    <div className="col-span-5 flex flex-col items-start gap-4 p-6 bg-slate-700 shadow">
      <div className="inline-flex items-center">
        <CalendarIcon className="h-text mr-2" />
        {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
      </div>
      <ul className="flex flex-wrap gap-2">
        {selectedConcertBands.map(concertBand => (
          <li key={concertBand.band_id} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        ))}
      </ul>
      {concert.description && <p>{concert.description}</p>}
      <Link href={`/${concert.id}`} key={concert.id}>
        <a className="btn"><PencilSquareIcon className="h-text mr-2" />Bearbeiten</a>
      </Link>
    </div>
  )
}