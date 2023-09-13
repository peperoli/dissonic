'use client'

import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  UsersIcon,
} from '@heroicons/react/20/solid'
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
import { UserItem } from './UserItem'

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
    month: 'short',
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
        <main className="container grid gap-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="btn btn-link">
              <ArrowLeftIcon className="h-icon" />
              Zurück
            </Link>
            <div className="flex gap-3">
              <Button
                onClick={
                  session ? () => setEditIsOpen(true) : () => push(`/login?redirect=${pathname}`)
                }
                label="Bearbeiten"
                icon={<PencilSquareIcon className="h-icon" />}
                contentType="icon"
                size="small"
              />
              <Button
                onClick={
                  session ? () => setDeleteIsOpen(true) : () => push(`/login?redirect=${pathname}`)
                }
                label="Löschen"
                icon={<TrashIcon className="h-icon" />}
                contentType="icon"
                danger
                size="small"
              />
            </div>
          </div>
          <div className="grid gap-4 p-4 md:p-6 rounded-lg bg-slate-800">
            <div className="flex justify-between items-start gap-4">
              {concert.name ? (
                <div>
                  {concert.is_festival && <p>Festival</p>}
                  <h1>{concert.name}</h1>
                </div>
              ) : (
                <h1>
                  {concert.bands && concert.bands[0]?.name} @ {concert.location?.name}
                </h1>
              )}
            </div>
            <ul className="flex flex-wrap gap-1">
              {concert.bands?.map((band, index) => (
                <li role="presentation" key={band.id}>
                  <Link href={`/bands/${band.id}`} className="font-bold">{band.name}</Link>
                  {index !== 0 ? <span className="text-slate-300">&bull;</span> : null}
                </li>
              ))}
            </ul>
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
            <div className="grid gap-4 mt-4">
              <div className="flex items-center">
                <CalendarIcon className="h-icon mr-2 text-slate-300" />
                <div>
                  <span>
                    {new Date(concert.date_start).toLocaleDateString('de-CH', dateFormat)}
                    {concert.date_end && <>&nbsp;&ndash; </>}
                  </span>
                  {concert.date_end && (
                    <span>
                      {new Date(concert.date_end).toLocaleDateString('de-CH', dateFormat)}
                    </span>
                  )}
                </div>
              </div>
              {concert.location && (
                <div className="inline-flex items-center">
                  <MapPinIcon className="h-icon mr-2 text-slate-300" />
                  <div>{concert.location.name}</div>
                </div>
              )}
              {fanProfiles && fanProfiles.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {fanProfiles.map(item => (
                    <UserItem profile={item} key={item.id} />
                  ))}
                </div>
              )}
            </div>
          </div>
          {concert.bands && (
            <div className="p-4 md:p-6 rounded-lg bg-slate-800">
              <GenreChart bands={concert.bands} />
            </div>
          )}
          <div className="p-4 md:p-6 rounded-lg bg-slate-800">
            <Comments />
          </div>
          <EditConcertForm isOpen={editIsOpen} setIsOpen={setEditIsOpen} />
          <DeleteConcertModal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
        </main>
      </ConcertContext.Provider>
    </PageWrapper>
  )
}
