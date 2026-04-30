import { Concert } from '@/types/types'
import * as ics from 'ics'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Temporal } from '@js-temporal/polyfill'

export function getIcsFile(concert: Concert) {
  const pathname = window.location.pathname
  const dateStart = Temporal.PlainDate.from(concert.date_start)
  const dateEnd = concert.date_end ? Temporal.PlainDate.from(concert.date_end) : dateStart
  const title =
    (concert.is_festival
      ? concert.festival_root?.name
      : concert.bands
          .slice(0, 5)
          .map(band => band.name)
          .join(', ')) ?? 'Concert'
  const event = {
    start: [
      dateStart.year,
      dateStart.month,
      dateStart.day,
      concert.show_time ? parseInt(concert.show_time.split(':')[0]) : 19,
      concert.show_time ? parseInt(concert.show_time.split(':')[1]) : 0,
    ],
    end: [dateEnd.year, dateEnd.month, dateEnd.day, 23, 0],
    title,
    description: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    location: `${concert.location?.name}, ${concert.location?.city}`,
    busyStatus: 'BUSY',
  } satisfies ics.EventAttributes

  ics.createEvent(event, (error, value) => {
    if (error) {
      console.error(error)
      return toast.error('Error creating ICS file')
    }

    const blob = new Blob([value], { type: 'text/calendar' })
    saveAs(blob, `${dateStart.toString()}-concert-${concert.id}.ics`)
  })
}
