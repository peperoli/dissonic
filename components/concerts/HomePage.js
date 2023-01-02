"use client"

import supabase from "../../utils/supabase"
import { ConcertCard} from './ConcertCard'
import Modal from '../Modal'
import AddConcertForm from "./AddConcertForm"
import { useState, useEffect } from 'react'
import { Button } from '../Button'
import { ArrowUturnLeftIcon, ChevronDownIcon, EyeIcon, GlobeAltIcon, PlusIcon } from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { toast } from 'react-toastify'
import FilterButton from '../FilterButton'
import useMediaQuery from '../../hooks/useMediaQuery'

export default function HomePage({ initialConcerts, bands, locations }) {
  const [isOpen, setIsOpen] = useState(false)
  const [concerts, setConcerts] = useState(initialConcerts || [])
  const [selectedBands, setSelectedBands] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [bandsSeen, setBandsSeen] = useState([])
  const [sort, setSort] = useState('dateAsc')
  const [user, setUser] = useState(null)
  const [view, setView] = useState('global')
  const [profiles, setProfiles] = useState([])

  const notifyInsert = () => toast.success("Konzert erfolgreich hinzugefügt!")

  function viewFilter(item) {
    if (view === 'user') {
      return item.bands.some(band =>
          bandsSeen.some(
            bandSeen =>
              bandSeen.concert_id === item.id &&
              bandSeen.band_id === band.id &&
              bandSeen.user_id === user.id
          )
        )
    }
    return true
  }

  function filterRule(item) {
    let [bandFilter, locationFilter] = [true, true]
    const selectedBandIds = selectedBands.map(item => item.id)
    const selectedLocationIds = selectedLocations.map(item => item.id)
    if (selectedBandIds.length > 0) {
      bandFilter = item.bands.some(band => selectedBandIds.includes(band.id))
    }
    if (selectedLocationIds.length > 0) {
      locationFilter = selectedLocationIds.includes(item.location?.id)
    }

    return bandFilter && locationFilter
  }

  const filteredLength = concerts.filter(filterRule && viewFilter).length !== concerts.length ? concerts.filter(filterRule && viewFilter).length : null

  function compare(a, b) {
    let comparison = 0
    if (a.date_start > b.date_start) {
      if (sort === 'dateAsc') {
        comparison = -1
      } else if (sort === 'dateDsc') {
        comparison = 1
      }
    } else if (a.date_start < b.date_start) {
      if (sort === 'dateAsc') {
        comparison = 1
      } else if (sort === 'dateDsc') {
        comparison = -1
      }
    }
    return comparison
  }

  function resetAll() {
    setSelectedBands([])
    setSelectedLocations([])
  }

  useEffect(() => {
    getUser()
    fetchProfiles()
  }, [])

  async function getUser() {
    const { data: { user: initUser } } = await supabase.auth.getUser()
    setUser(initUser)
  }

  async function fetchProfiles() {
    try {
      const {data: profilesData, error: profilesError} = await supabase
      .from('profiles')
      .select('*')

      if (profilesError) {
        throw profilesError
      }

      setProfiles(profilesData)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    async function getBandsSeen() {
      try {
        const { data: initBandsSeen, error: selectedBandsSeenError } = await supabase
          .from('j_bands_seen')
          .select('*')

        if (selectedBandsSeenError) {
          throw selectedBandsSeenError
        }

        if (initBandsSeen) {
          setBandsSeen(initBandsSeen)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    if (user) {
      getBandsSeen()
      setView('user')
    }
  }, [user])

  function changeView(event) {
    setView(event.target.value)
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (
    <PageWrapper>
      <main className="w-full max-w-2xl p-4 md:p-8">
        {!isDesktop && (
          <div className="fixed bottom-0 right-0 m-4">
            <Button
              onClick={() => setIsOpen(true)}
              label="Konzert hinzufügen"
              style="primary"
              contentType="icon"
              icon={<PlusIcon className="h-icon" />}
            />
          </div>
        )}
        <div className="sr-only md:not-sr-only flex justify-between items-center mb-6">
          <h1>Konzerte</h1>
          {isDesktop && (
            <Button
              onClick={() => setIsOpen(true)}
              label="Konzert hinzufügen"
              style="primary"
              icon={<PlusIcon className="h-icon" />}
            />
          )}
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">
              {typeof filteredLength === 'number' && <>{filteredLength}&nbsp;von&nbsp;</>}{concerts.length}&nbsp;Einträge
            </div>
            {concerts.filter(filterRule).length !== concerts.length && (
              <button onClick={resetAll} className="btn btn-secondary btn-small">
                <ArrowUturnLeftIcon className="h-icon text-slate-300" />
                Zurücksetzen
              </button>
            )}
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible">
            <FilterButton
              name="bands"
              options={bands}
              selectedOptions={selectedBands}
              setSelectedOptions={setSelectedBands}
            />
            <FilterButton
              name="locations"
              options={locations}
              selectedOptions={selectedLocations}
              setSelectedOptions={setSelectedLocations}
            />
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <fieldset className="flex rounded-md bg-slate-800">
                <label className={`px-2 py-1 rounded-md${view === 'global' ? ' text-venom bg-slate-700' : ''}`}>
                  <span>Alle</span>
                  <input
                    type="radio"
                    name="view"
                    value="global"
                    onChange={changeView}
                    checked={view === 'global'}
                    className="sr-only"
                  />
                </label>
                <label className={`px-2 py-1 rounded-md${view === 'user' ? ' text-venom bg-slate-700' : ''}`}>
                  <span>Gesehene</span>
                  <input
                    type="radio"
                    name="view"
                    value="user"
                    onChange={changeView}
                    checked={view === 'user'}
                    className="sr-only"
                  />
                </label>
              </fieldset>
            )}
            <div className="flex items-center ml-auto text-sm">
              <label htmlFor="sortBy" className="sr-only md:not-sr-only text-slate-300">
                Sortieren nach:
              </label>
              <div className="relative flex items-center">
                <select onChange={(e) => setSort(e.target.value)} name="sortBy" id="sortBy" className="pl-2 pr-7 py-1 rounded-md hover:bg-slate-800 bg-transparent appearance-none">
                  <option value="dateAsc">Neuste</option>
                  <option value="dateDsc">Älteste</option>
                </select>
                <ChevronDownIcon className="absolute right-2 text-xs h-icon pointer-events-none" />
              </div>
            </div>
          </div>
          {typeof filteredLength === 'number' && filteredLength === 0 ? (
            <div>Blyat! Keine Einträge gefunden.</div>
          ) : (
            concerts.filter(filterRule && viewFilter).sort(compare).map(concert => (
              <ConcertCard
                key={concert.id}
                concert={concert}
                bandsSeen={bandsSeen.filter(row => row.concert_id === concert.id)}
                user={user}
                profiles={profiles}
              />
            ))
          )}
        </div>
      </main>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <AddConcertForm
          bands={bands}
          locations={locations}
          setIsOpen={setIsOpen}
          concerts={concerts}
          setConcerts={setConcerts}
        />
      </Modal>
    </PageWrapper>
  )
}
