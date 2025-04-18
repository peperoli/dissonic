import { Concert } from '@/types/types'
import ics from 'ics'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

export function getIcsFile(concert: Concert) {
  const pathname = window.location.pathname
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : dateStart
  const title =
    (concert.is_festival
      ? concert.festival_root?.name
      : concert.bands
          .slice(0, 5)
          .map(band => band.name)
          .join(', ')) ?? 'Concert'
  const event = {
    start: [dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate(), 19, 0],
    end: [dateEnd.getFullYear(), dateEnd.getMonth() + 1, dateEnd.getDate(), 23, 0],
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
    saveAs(
      blob,
      `${new Date(concert.date_start).toISOString().split('T').shift()}-concert-${concert.id}.ics`
    )
  })
}
