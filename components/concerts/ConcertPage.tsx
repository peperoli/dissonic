'use client'

import { ArrowLeftIcon, CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/20/solid'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useConcert } from '../../hooks/useConcert'
import { ConcertContext } from '../../hooks/useConcertContext'
import { useProfiles } from '../../hooks/useProfiles'
import { BandSeen, Concert } from '../../types/types'
import supabase from '../../utils/supabase'
import { Button } from '../Button'
import { PageWrapper } from '../layout/PageWrapper'
import { BandSeenToggle } from './BandSeenToggle'
import { Comments } from './Comments'
import { DeleteConcertModal } from './DeleteConcertModal'
import { EditConcertForm } from './EditConcertForm'
import { GenreChart } from './GenreChart'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/useSession'

interface ConcertPageProps {
  initialConcert: Concert
}

export const ConcertPage = ({ initialConcert }: ConcertPageProps) => {
  const { data: profiles } = useProfiles()
  const { data: concert } = useConcert(initialConcert, initialConcert.id)
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [bandsSeen, setBandsSeen] = useState<BandSeen[]>([])
  const [selectedBandsSeen, setSelectedBandsSeen] = useState<BandSeen[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const concertBandsSeen = concert?.bands_seen?.filter(item => item.user_id === session?.user.id)
    setBandsSeen(concertBandsSeen || [])
    setSelectedBandsSeen(concertBandsSeen || [])
  }, [concert?.bands_seen?.length, session])

  const addBandsSeen = selectedBandsSeen.filter(
    item => !bandsSeen?.find(item2 => item.band_id === item2.band_id)
  )
  const deleteBandsSeen = bandsSeen?.filter(
    item => !selectedBandsSeen.find(item2 => item.band_id === item2.band_id)
  )
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year:
      concert && new Date(concert.date_start).getFullYear() === new Date().getFullYear()
        ? undefined
        : 'numeric',
  }
  const fanIds = concert?.bands_seen && new Set(concert.bands_seen.map(item => item.user_id))
  const fanProfiles = profiles?.filter(profile => fanIds?.has(profile.id))
  const { push } = useRouter()
  const pathname = usePathname()

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
        .eq('concert_id', concert?.id)
        .eq('user_id', session?.user.id)
        .in(
          'band_id',
          deleteBandsSeen.map(item => item.band_id)
        )

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }

      setBandsSeen(selectedBandsSeen)
      queryClient.invalidateQueries(['concert', concert?.id])
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

  if (!concert) {
    return (
      <PageWrapper>
        <h1>Konzert nicht gefunden</h1>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ConcertContext.Provider value={{ concert }}>
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
                    user={session?.user || null}
                    band={band}
                    selectedBandsSeen={selectedBandsSeen}
                    setSelectedBandsSeen={setSelectedBandsSeen}
                  />
                ))}
            </div>
            {session && (
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
                {new Date(concert.date_start).toLocaleDateString('de-CH', dateFormat)}
                {concert.date_end && (
                  <span>
                    &nbsp;&ndash;{' '}
                    {new Date(concert.date_end).toLocaleDateString('de-CH', dateFormat)}
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
            {fanProfiles && fanProfiles.length > 0 ? (
              <div className="flex text-sm">
                <UsersIcon className="flex-none h-icon mr-2 self-center text-slate-300" />
                <div>
                  {fanProfiles.map(item => (
                    <Link key={item.id} href={`/users/${item.username}`} className="btn btn-link">
                      {item?.username}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex text-sm">
                <UsersIcon className="flex-none h-icon mr-2 self-center text-slate-300" />
                <div className="py-1 text-slate-300">Niemand da :/</div>
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={session ? () => setEditIsOpen(true) : () => push(`/login?redirect=${pathname}`)} label="Bearbeiten" />
              <Button onClick={session ? () => setDeleteIsOpen(true) : () => push(`/login?redirect=${pathname}`)} label="Löschen" danger />
            </div>
          </div>
          {concert.bands && (
            <div className="p-6 rounded-lg bg-slate-800">
              <GenreChart bands={concert.bands} />
            </div>
          )}
          <div className="p-6 rounded-lg bg-slate-800">
            <Comments />
          </div>
          <EditConcertForm isOpen={editIsOpen} setIsOpen={setEditIsOpen} />
          <DeleteConcertModal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
        </main>
      </ConcertContext.Provider>
    </PageWrapper>
  )
}
