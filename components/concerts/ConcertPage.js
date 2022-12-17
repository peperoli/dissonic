"use client"

import supabase from "../../utils/supabase"
import Link from "next/link"
import EditConcertForm from "./EditConcertForm"
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/20/solid"
import { useEffect, useState } from "react"
import PageWrapper from "../layout/PageWrapper"
import Modal from "../Modal"
import { Button } from "../Button"
import dayjs from "dayjs"
import 'dayjs/locale/de'
import { useRouter } from "next/navigation"
import GenreChart from "./GenreChart"
import Comments from "./Comments"

function BandSeenCheckbox({ concert, band, selectedBandsSeen, setSelectedBandsSeen, user }) {
  const router = useRouter()
  const isSeen = selectedBandsSeen && selectedBandsSeen.some(item => item.band_id === band.id && item.user_id === user.id) ? true : false

  function handleChange() {
    if (user) {
      if (isSeen) {
        setSelectedBandsSeen(selectedBandsSeen.filter(item => item.band_id !== band.id))
      } else {
        setSelectedBandsSeen([
          ...selectedBandsSeen,
          {
            concert_id: concert.id,
            user_id: user.id,
            band_id: band.id,
          }
        ])
      }
    } else {
      router.push('/login')
    }
  }
  return (
    <label className={`btn btn-tag ${isSeen ? 'btn-seen' : ''}`}>
      <input
        type="checkbox"
        name="seenBands"
        value={`seenBand${band.id}`}
        checked={isSeen}
        onChange={handleChange}
        className="sr-only"
      />
      {band.name}
    </label>
  )
}

export default function ConcertPage({ initialConcert, bands, locations }) {
  const [concert, setConcert] = useState(initialConcert)
  const [selectedBandsSeen, setSelectedBandsSeen] = useState([])
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [bandsSeen, setBandsSeen] = useState([])
  const [allBandsSeen, setAllBandsSeen] = useState(null)
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState([])

  const addBandsSeen = selectedBandsSeen.filter(item => !bandsSeen?.find(item2 => item.band_id === item2.band_id))
  const deleteBandsSeen = bandsSeen?.filter(item => !selectedBandsSeen.find(item2 => item.band_id === item2.band_id))
  const router = useRouter()
  const dateFormat = new Date(concert.date_start).getFullYear() === new Date().getFullYear() ? 'DD. MMM' : 'DD. MMM YYYY'
  let fanProfiles
  if (allBandsSeen?.length > 0) {
    const fanIds = new Set(allBandsSeen.map(item => item.user_id))
    fanProfiles = [...fanIds].map(item => profiles.find(profile => profile.id === item))
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
      const { data: profilesData, error: profilesError } = await supabase
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
          .eq('concert_id', concert.id)

        if (selectedBandsSeenError) {
          throw selectedBandsSeenError
        }

        if (initBandsSeen) {
          setSelectedBandsSeen(initBandsSeen.filter(item => item.user_id === user.id))
          setBandsSeen(initBandsSeen.filter(item => item.user_id === user.id))
          setAllBandsSeen(initBandsSeen)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    if (user) {
      getBandsSeen()
    }
  }, [user, concert.id])

  async function updateBandsSeen() {
    try {
      setLoading(true)

      const { error: addBandsSeenError } = await supabase
        .from('j_bands_seen')
        .insert(addBandsSeen)

      if (addBandsSeenError) {
        throw addBandsSeenError
      }

      const { error: deleteBandsSeenError } = await supabase
        .from('j_bands_seen')
        .delete()
        .eq('concert_id', concert.id)
        .eq('user_id', user.id)
        .in('band_id', deleteBandsSeen.map(item => item.band_id))

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }

      setBandsSeen(selectedBandsSeen)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function deleteConcert() {
    try {
      const { error: deleteBandsSeenError } = await supabase.from('j_bands_seen').delete().eq('concert_id', concert.id)

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }

      const { error: deleteBandsError } = await supabase.from('j_concert_bands').delete().eq('concert_id', concert.id)

      if (deleteBandsError) {
        throw deleteBandsError
      }

      const { error: deleteConcertError } = await supabase.from('concerts').delete().eq('id', concert.id)

      if (deleteConcertError) {
        throw deleteConcertError
      }

      try {
        router.push('/')
      } catch {

      }
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <PageWrapper>
      <main className="grid gap-4 w-full max-w-2xl p-8">
        <div>
          <Link href="/" className="btn btn-link">
            <ArrowLeftIcon className="h-icon" />
            Go Back
          </Link>
        </div>
        <div className="grid gap-4 p-6 rounded-lg bg-slate-800">
          {concert.name ? (
            <>
              {concert.is_festival && <p>Festival</p>}
              <h1>{concert.name}</h1>
            </>
          ) : (
            <h1>{concert.bands[0]?.name} @ {concert.location?.name}</h1>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {concert.bands && concert.bands.map(band => (
              <BandSeenCheckbox
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
          <div className="flex gap-4 w-full mt-4">
            <div className="inline-flex items-center">
              <CalendarIcon className="h-icon mr-2" />
              {dayjs(concert.date_start).locale('de-ch').format(dateFormat)}
              {concert.date_end && <span>&nbsp;&ndash; {dayjs(concert.date_end).locale('de-ch').format(dateFormat)}</span>}
            </div>
            {concert.location && (
              <div className="inline-flex items-center">
                <MapPinIcon className="h-icon mr-2" />
                {concert.location.name}
              </div>
            )}
          </div>
          {fanProfiles && (
            <div className="flex text-sm">
              <UsersIcon className="flex-none h-icon mr-2 self-center text-slate-300" />
              <div className="-ml-2">
                {fanProfiles.map(item => (
                  <Link key={item.id} href={`/users/${item.username}`} className="btn btn-tag">
                    {item.username}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-6 rounded-lg bg-slate-800">
          <GenreChart bands={concert.bands} />
        </div>
        <div className="p-6 rounded-lg bg-slate-800">
          <Comments 
            concert={concert} 
            user={user} 
            profiles={profiles} 
          />
        </div>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => setEditIsOpen(true)} label="Bearbeiten" />
          <Button onClick={() => setDeleteIsOpen(true)} label="Löschen" />
        </div>
        <Modal
          isOpen={editIsOpen}
          setIsOpen={setEditIsOpen}
        >
          <EditConcertForm
            concert={concert}
            bands={bands}
            locations={locations}
            setIsOpen={setEditIsOpen}
            setConcert={setConcert}
          />
        </Modal>
        <Modal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen}>
          <div>
            <h2>Konzert löschen</h2>
            Willst du dieses Konzert wirklich löschen?
            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setDeleteIsOpen(false)} label="Abbrechen" />
              <button onClick={deleteConcert} className="btn btn-primary btn-danger">
                Löschen
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </PageWrapper>
  )
}