import Link from "next/link"
import { PencilSquareIcon, CalendarIcon } from "@heroicons/react/24/solid"

export default function ConcertCard({ concert, bands, concertBands }) {
  const selectedConcertBands = concertBands.filter(concertBand => concertBand.gagu === concert.id)
  return (
    <div className="col-span-5 p-4 bg-slate-700 shadow">
      <div className="inline-flex items-center"><PencilSquareIcon className="h-text mr-2" /> {concert.date_start}</div>
      <ul className="flex gap-2">
        {selectedConcertBands.map(concertBand => (
          <li key={concertBand.id} className="btn btn-tag">
            {bands.find(band => band.id === concertBand.band_id).name}
          </li>
        ))}
      </ul>
      <Link href={`/${concert.id}`} key={concert.id}>
        <a>Bearbeiten</a>
      </Link>
    </div>
  )
}