import Link from "next/link"
import { PencilSquareIcon, CalendarIcon } from "@heroicons/react/24/solid"

export default function ConcertCard({ concert, bands, concertBands }) {
  const selectedConcertBands = concertBands.filter(concertBand => concertBand.concert_id === concert.id)
  return (
    <div className="col-span-5 flex flex-col items-start gap-4 p-6 bg-slate-700 shadow">
      <div className="inline-flex items-center"><CalendarIcon className="h-text mr-2" /> {concert.date_start}</div>
      <ul className="flex gap-2">
        {selectedConcertBands.map(concertBand => (
          <li key={concertBand.band_id} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        ))}
      </ul>
      <Link href={`/${concert.id}`} key={concert.id}>
        <a className="btn"><PencilSquareIcon className="h-text mr-2" />Bearbeiten</a>
      </Link>
    </div>
  )
}