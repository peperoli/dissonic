import Link from "next/link"
import { ChatBubbleBottomCenterTextIcon, MapPinIcon } from "@heroicons/react/24/solid"
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import { useRouter } from "next/router"

<<<<<<< Updated upstream
export default function ConcertCard({ concert, bandsSeen }) {
=======
function ConcertDate({ date }) {
  return (
    <div className="relative flex-none flex flex-col justify-center items-center w-20 h-20 border border-slate-700 rounded-lg first:bg-slate-700 shadow-md">
      {date && <span className="text-3xl font-bold">{date.getDate()}</span>}
      {date && <span className="text-sm">{dayjs(date).locale('de-ch').format('MMM')}</span>}
      {date?.getFullYear() !== new Date().getFullYear() && <span className="absolute -bottom-3 px-2 py-1 rounded-full text-xs font-bold text-slate-850 bg-blue-300">{date.getFullYear()}</span>}
    </div>
  )
}

<<<<<<< Updated upstream
export default function ConcertCard({ concert, bands, bandsSeen, locations }) {
>>>>>>> Stashed changes
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'
=======
export default function ConcertCard({ concert, bandsSeen }) {
  const router = useRouter()
>>>>>>> Stashed changes
  return (
    <div onClick={() => router.push(`/concerts/${concert.id}`)} className="flex gap-4 p-6 rounded-2xl bg-slate-800 hover:cursor-pointer">
      <div className="flex flex-col items-center">
        <ConcertDate date={new Date(concert.date_start)} />
        {concert.date_end && concert.date_end !== concert.date_start && (
          <>
            <div className="h-4 border-l border-slate-700" />
            <ConcertDate date={new Date(concert.date_end)} />
          </>
        )}
      </div>
      <div>
        {concert.name && <div className="btn btn-tag !bg-deepPurple mb-2">{concert.name}</div>}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {concert.bands && concert.bands.map((band, index) => (
            <>
              {index !== 0 ? <span className="text-slate-300">&bull;</span> : null}
              <Link key={band.id} href={`/bands/${band.id}`}>
                <a className={`first:text-xl font-bold${bandsSeen?.band_ids && bandsSeen.band_ids.some(bandSeen => bandSeen === band) ? ' btn-seen' : ''}`}>
                  {band.name}
                </a>
              </Link>
            </>
          ))}
        </div>
<<<<<<< Updated upstream
        {concert.location && (
          <div className="inline-flex items-center">
            <MapPinIcon className="h-text mr-2" />
            {concert.location?.name}
          </div>
        )}
        <Link href={`/concerts/${concert.id}`} key={concert.id}>
          <a className="btn btn-link ml-auto"><ArrowRightIcon className="h-text" />Mehr anzeigen</a>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {concert.bands && concert.bands.map(concertBand => (
          <Link key={concertBand.id} href={`/bands/${concertBand}`}>
            <a className={`btn btn-tag${bandsSeen?.band_ids && bandsSeen.band_ids.some(bandSeen => bandSeen === concertBand) ? ' btn-seen' : ''}`}>
              {concertBand.name}
            </a>
          </Link>
        ))}
=======
        <div className="flex gap-4 w-full mb-2">
          {concert.location && (
            <div className="inline-flex items-center text-sm">
              <MapPinIcon className="h-text mr-2 text-slate-300" />
              {concert.location?.name}
            </div>
          )}
        </div>
        {concert.description && (
          <div className="flex text-sm">
            <ChatBubbleBottomCenterTextIcon className="flex-none h-text mr-2 self-center text-slate-300" />
            <p className="italic text-slate-300">{concert.description}</p>
          </div>
        )}
>>>>>>> Stashed changes
      </div>
    </div>
  )
}