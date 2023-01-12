'use client'

import supabase from '../../utils/supabase'
import Link from 'next/link'
import { EditConcertForm } from './EditConcertForm'
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import React, { FC, useEffect, useState } from 'react'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import { GenreChart } from './GenreChart'
import Comments from './Comments'
import { DeleteConcertModal } from './DeleteConcertModal'
import { Band, BandSeen, Concert, Location, Profile } from '../../models/types'
import { User } from '@supabase/supabase-js'
import { BandSeenToggle } from './BandSeenToggle'

interface ConcertPageProps {
  initialConcert: Concert
  bands: Band[]
  locations: Location[]
  profiles: Profile[]
}

export const ConcertPage: FC<ConcertPageProps> = ({
  initialConcert,
  bands,
  locations,
  profiles,
}) => {
  const [concert, setConcert] = useState(initialConcert)
  const [selectedBandsSeen, setSelectedBandsSeen] = useState<BandSeen[]>([])
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [bandsSeen, setBandsSeen] = useState<BandSeen[]>([])
  const [allBandsSeen, setAllBandsSeen] = useState<BandSeen[] | null>(null)
  const [loading, setLoading] = useState(false)

  const addBandsSeen = selectedBandsSeen.filter(
    item => !bandsSeen?.find(item2 => item.band_id === item2.band_id)
  )
  const deleteBandsSeen = bandsSeen?.filter(
    item => !selectedBandsSeen.find(item2 => item.band_id === item2.band_id)
  )
  const dateFormat =
    new Date(concert.date_start).getFullYear() === new Date().getFullYear()
      ? 'DD. MMM'
      : 'DD. MMM YYYY'
  const fanIds = new Set(allBandsSeen?.map(item => item.user_id))
  const fanProfiles = [...fanIds].map(item => profiles.find(profile => profile.id === item))

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const {
      data: { user: initUser },
    } = await supabase.auth.getUser()
    setUser(initUser)
  }

  useEffect(() => {
    async function getBandsSeen() {
      try {
        const { data: initBandsSeen, error: selectedBandsSeenError } = await supabase
          .from('j_bands_seen')
          .select('*')
          .eq('concert_id', concert.id)

        if (selectedBandsSeenError) {
          throw selectedBandsSeenError
        }

        if (initBandsSeen) {
          setSelectedBandsSeen(initBandsSeen.filter(item => item.user_id === user?.id))
          setBandsSeen(initBandsSeen.filter(item => item.user_id === user?.id))
          setAllBandsSeen(initBandsSeen)
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        } else {
          alert('Unexpected error. See browser console for more information.')
          console.error(error)
        }
      }
    }

    if (user) {
      getBandsSeen()
    }
  }, [user, concert.id])

  async function updateBandsSeen() {
    try {
      setLoading(true)

      const { error: addBandsSeenError } = await supabase.from('j_bands_seen').insert(addBandsSeen)

      if (addBandsSeenError) {
        throw addBandsSeenError
      }

      const { error: deleteBandsSeenError } = await supabase
        .from('j_bands_seen')
        .delete()
        .eq('concert_id', concert.id)
        .eq('user_id', user?.id)
        .in(
          'band_id',
          deleteBandsSeen.map(item => item.band_id)
        )

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }

      setBandsSeen(selectedBandsSeen)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Unexpected error. See browser console for more information.')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <PageWrapper>
      <main className="grid gap-4 w-full max-w-2xl p-4 md:p-8">
        <div>
          <Link href="/" className="btn btn-link">
            <ArrowLeftIcon className="h-icon" />
            Zurück
          </Link>
        </div>
        <div className="grid gap-4 p-6 rounded-lg bg-slate-800">
          {concert.name ? (
            <>
              {concert.is_festival && <p>Festival</p>}
              <h1>{concert.name}</h1>
            </>
          ) : (
            <h1>
              {concert.bands && concert.bands[0]?.name} @ {concert.location?.name}
            </h1>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {concert.bands &&
              concert.bands.map(band => (
                <BandSeenToggle
                  key={band.id}
                  user={user}
                  concert={concert}
                  band={band}
                  selectedBandsSeen={selectedBandsSeen}
                  setSelectedBandsSeen={setSelectedBandsSeen}
                />
              ))}
          </div>
          {user && (
            <div>
              <Button
                onClick={updateBandsSeen}
                label="Speichern"
                style="primary"
                loading={loading}
                disabled={addBandsSeen?.length === 0 && deleteBandsSeen?.length === 0}
              />
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
            <div className="inline-flex items-center">
              <CalendarIcon className="h-icon mr-2 text-slate-300" />
              {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
              {concert.date_end && (
                <span>
                  &nbsp;&ndash; {dayjs(concert.date_end).locale('de-ch').format(dateFormat)}
                </span>
              )}
            </div>
            {concert.location && (
              <div className="inline-flex items-center">
                <MapPinIcon className="h-icon mr-2 text-slate-300" />
                {concert.location.name}
              </div>
            )}
          </div>
          {fanProfiles && (
            <div className="flex text-sm">
              <UsersIcon className="flex-none h-icon mr-2 self-center text-slate-300" />
              <div className="-ml-2">
                {fanProfiles?.map(item => (
                  <Link key={item?.id} href={`/users/${item?.username}`} className="btn btn-tag">
                    {item?.username}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={() => setEditIsOpen(true)} label="Bearbeiten" />
            <Button onClick={() => setDeleteIsOpen(true)} label="Löschen" danger />
          </div>
        </div>
        {concert.bands && (
          <div className="p-6 rounded-lg bg-slate-800">
            <GenreChart bands={concert.bands} />
          </div>
        )}
        <div className="p-6 rounded-lg bg-slate-800">
          <Comments concert={concert} user={user} profiles={profiles} />
        </div>
        <EditConcertForm
          concert={concert}
          bands={bands}
          locations={locations}
          isOpen={editIsOpen}
          setIsOpen={setEditIsOpen}
          setConcert={setConcert}
        />
        <DeleteConcertModal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} concert={concert} />
      </main>
    </PageWrapper>
  )
}
