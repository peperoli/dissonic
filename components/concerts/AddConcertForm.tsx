import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react'
import supabase from '../../utils/supabase'
import { MultiSelect } from '../MultiSelect'
import dayjs from 'dayjs'
import { Button } from '../Button'
import { useRouter } from 'next/navigation'
import Modal from '../Modal'
import { Band, ConcertWithBands, Location } from '../../models/types'
import Link from 'next/link'

interface AddConcertFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  bands: Band[]
  locations: Location[]
  concerts: ConcertWithBands[]
}

export const AddConcertForm: FC<AddConcertFormProps> = ({
  isOpen,
  setIsOpen,
  bands,
  locations,
  concerts,
}) => {
  const [selectedBands, setSelectedBands] = useState<Band[]>([])
  const [isFestival, setIsFestival] = useState(false)
  const [loading, setLoading] = useState(false)

  const [today] = dayjs().format().split('T')
  const [tomorrow] = dayjs().add(1, 'day').format().split('T')

  const [dateStart, setDateStart] = useState(today)
  const [location, setLocation] = useState('')

  const router = useRouter()

  const similarConcerts = concerts
    .filter(item => item.date_start === dateStart)
    .filter(item =>
      item.bands.find(band => selectedBands.find(selectedBand => band.id === selectedBand.id))
    )
    .filter(item => item.location.id === Number(location))
  const isSimilar = similarConcerts.length > 0

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: { value: string }
      isFestival: { checked: boolean }
      dateStart: { value: Date }
      dateEnd: { value: Date }
      location: { value: string }
    }

    try {
      setLoading(true)
      const { data: concert, error: insertConcertError } = await supabase
        .from('concerts')
        .insert([
          {
            date_start: target.dateStart.value,
            date_end: target.dateEnd?.value,
            location: target.location.value,
            name: target.name.value,
            is_festival: target.isFestival.checked,
          },
        ])
        .select()
        .single()

      if (insertConcertError) {
        throw insertConcertError
      }

      const { error: addBandsError } = await supabase
        .from('j_concert_bands')
        .insert(selectedBands.map(band => ({ concert_id: concert?.id, band_id: band.id })))

      if (addBandsError) {
        throw addBandsError
      }

      router.push(`/concerts/${concert.id}`)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        console.error('Unexpected error', error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <h2>Konzert hinzufügen</h2>
        <div className="form-control">
          <input type="text" name="name" id="name" placeholder="Wacken Open Air" />
          <label htmlFor="name">Name (optional)</label>
        </div>
        <div className="form-control">
          <label>
            <input
              type="checkbox"
              name="isFestival"
              value="isFestival"
              checked={isFestival}
              onChange={() => setIsFestival(!isFestival)}
            />
            <span>Festival</span>
          </label>
        </div>
        <div className="flex gap-4">
          <div className="form-control">
            <input
              type="date"
              name="dateStart"
              id="dateStart"
              value={dateStart}
              onChange={event => setDateStart(event.target.value)}
            />
            <label htmlFor="dateStart">Datum</label>
          </div>
          {isFestival && (
            <div className="form-control">
              <input type="date" name="dateEnd" id="dateEnd" defaultValue={tomorrow} />
              <label htmlFor="dateEnd">Enddatum</label>
            </div>
          )}
        </div>
        <MultiSelect
          name="bands"
          options={bands}
          selectedOptions={selectedBands}
          setSelectedOptions={setSelectedBands}
        />
        <div className="form-control">
          <select
            name="location"
            id="location"
            value={location}
            onChange={event => setLocation(event.target.value)}
          >
            <option value="" disabled hidden>
              Bitte wählen ...
            </option>
            {locations &&
              locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
          </select>
          <label htmlFor="location">Location</label>
        </div>
        {isSimilar && (
          <div className="p-4 rounded-lg bg-yellow/10">
            <div className="text-yellow">
              Folgende Konzerte mit ähnlichen Eigenschaften existieren bereits:
            </div>
            <div className="grid gap-2 mt-4">
              {similarConcerts.map(item => (
                <Link
                  key={item.id}
                  href={`/concerts/${item.id}`}
                  className="block px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-750"
                >
                  <div>{item.date_start}</div>
                  <div className="font-bold">
                    {item.bands
                      .slice(0, 10)
                      .map(band => band.name)
                      .join(', ')}
                  </div>
                  <div>@ {item.location.name}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Erstellen" style="primary" loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
