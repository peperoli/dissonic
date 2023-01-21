'use client'

import supabase from '../../utils/supabase'
import { ConcertCard } from './ConcertCard'
import { AddConcertForm } from './AddConcertForm'
import React, { useState, useEffect, FC } from 'react'
import { Button } from '../Button'
import {
  ArrowUturnLeftIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { MultiSelectFilter } from '../MultiSelectFilter'
import useMediaQuery from '../../hooks/useMediaQuery'
import { RangeFilter } from '../RangeFilter'
import { Band, BandSeen, Concert, Location, Profile } from '../../types/types'
import { User } from '@supabase/supabase-js'

interface HomePageProps {
  concerts: Concert[]
  bands: Band[]
  locations: Location[]
  profiles: Profile[]
}

export const HomePage: FC<HomePageProps> = ({ concerts, bands, locations, profiles }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBands, setSelectedBands] = useState<Band[]>([])
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedBandsPerConcert, setSelectedBandsPerConcert] = useState<number[]>([])
  const [bandsSeen, setBandsSeen] = useState<BandSeen[]>([])
  const [sort, setSort] = useState('dateAsc')
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState('global')
  const initialYears: number[] = concerts
    .map(item => new Date(item.date_start).getFullYear())
    .sort((a, b) => a - b)
  const bandsPerConcert: number[] = concerts
    .map(item => item.bands?.length || 0)
    .sort((a, b) => a - b)
    

  function viewFilter(item: Concert) {
    if (view === 'user') {
      return item.bands?.some(band =>
        bandsSeen.some(
          bandSeen =>
            bandSeen.concert_id === item.id &&
            bandSeen.band_id === band.id &&
            bandSeen.user_id === user?.id
        )
      )
    }
    return true
  }

  function filterRule(item: Concert) {
    let bandFilter = true
    let locationFilter = true
    let yearsFilter = true
    let bandsPerConcertFilter = true
    const selectedBandIds = selectedBands.map(item => item.id)
    const selectedLocationIds = selectedLocations.map(item => item.id)

    if (selectedBandIds.length > 0) {
      bandFilter = item.bands ? item.bands.some(band => selectedBandIds.includes(band.id)) : false
    }

    if (selectedLocationIds.length > 0) {
      locationFilter = item.location ? selectedLocationIds.includes(item.location.id) : false
    }

    if (selectedYears.length > 0) {
      yearsFilter = selectedYears.includes(new Date(item.date_start).getFullYear())
    }

    if (selectedBandsPerConcert.length > 0) {
      bandsPerConcertFilter = selectedBandsPerConcert.includes(item.bands?.length || 0)
    }

    return bandFilter && locationFilter && yearsFilter && bandsPerConcertFilter
  }

  const filteredLength = concerts.filter(filterRule).filter(viewFilter).length

  function compare(a: Concert, b: Concert) {
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
    setSelectedYears([])
    setSelectedBandsPerConcert([])
  }

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: initUser },
      } = await supabase.auth.getUser()
      setUser(initUser)
    }

    getUser()
  }, [])

  useEffect(() => {
    async function getBandsSeen() {
      try {
        const { data: initBandsSeen, error } = await supabase
          .from('j_bands_seen')
          .select('*')

        if (error) {
          throw error
        }

        setBandsSeen(initBandsSeen)
      } catch (error) {
        console.error(error)
      }
    }

    if (user) {
      getBandsSeen()
      setView('user')
    }
  }, [user])

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
              {filteredLength !== concerts.length && `${filteredLength} von `}
              {concerts.length}&nbsp;Einträge
            </div>
            {concerts.filter(filterRule).length !== concerts.length && (
              <button onClick={resetAll} className="btn btn-secondary btn-small">
                <ArrowUturnLeftIcon className="h-icon text-slate-300" />
                Zurücksetzen
              </button>
            )}
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <MultiSelectFilter
              name="bands"
              options={bands}
              selectedOptions={selectedBands}
              setSelectedOptions={setSelectedBands}
            />
            <MultiSelectFilter
              name="locations"
              options={locations}
              selectedOptions={selectedLocations}
              setSelectedOptions={setSelectedLocations}
            />
            <RangeFilter
              name="Jahre"
              unit='Jahr'
              options={initialYears}
              selectedOptions={selectedYears}
              setSelectedOptions={setSelectedYears}
            />
            <RangeFilter
              name="Bands pro Konzert"
              unit='Bands'
              options={bandsPerConcert}
              selectedOptions={selectedBandsPerConcert}
              setSelectedOptions={setSelectedBandsPerConcert}
            />
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <fieldset className="flex rounded-md bg-slate-800">
                <label
                  className={`flex items-center gap-2 px-2 py-1 rounded-md${
                    view === 'global' ? ' text-venom bg-slate-700 shadow-lg' : ''
                  }`}
                >
                  <GlobeAltIcon className="h-icon" />
                  <span>Alle</span>
                  <input
                    type="radio"
                    name="view"
                    value="global"
                    onChange={event => setView(event.target.value)}
                    checked={view === 'global'}
                    className="sr-only"
                  />
                </label>
                <label
                  className={`flex items-center gap-2 px-2 py-1 rounded-md${
                    view === 'user' ? ' text-venom bg-slate-700 shadow-lg' : ''
                  }`}
                >
                  <UserIcon className="h-icon" />
                  <span>Gesehene</span>
                  <input
                    type="radio"
                    name="view"
                    value="user"
                    onChange={event => setView(event.target.value)}
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
                <select
                  onChange={e => setSort(e.target.value)}
                  name="sortBy"
                  id="sortBy"
                  className="pl-2 pr-7 py-1 rounded-md hover:bg-slate-800 bg-transparent appearance-none"
                >
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
            concerts
              .filter(filterRule)
              .filter(viewFilter)
              .sort(compare)
              .map(concert => (
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
      <AddConcertForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        bands={bands}
        locations={locations}
        concerts={concerts}
      />
    </PageWrapper>
  )
}
