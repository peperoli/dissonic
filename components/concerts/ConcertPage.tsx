'use client'

import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useState } from 'react'
import { useConcert } from '../../hooks/useConcert'
import { ConcertContext } from '../../hooks/useConcertContext'
import { useProfiles } from '../../hooks/useProfiles'
import { Concert } from '../../types/types'
import { Button } from '../Button'
import { PageWrapper } from '../layout/PageWrapper'
import { Comments } from './Comments'
import { DeleteConcertModal } from './DeleteConcertModal'
import { EditConcertForm } from './EditConcertForm'
import { GenreChart } from './GenreChart'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/useSession'
import { UserItem } from './UserItem'
import { BandList } from './BandList'

interface ConcertPageProps {
  initialConcert: Concert
  concertQueryState?: string
}

export const ConcertPage = ({ initialConcert, concertQueryState }: ConcertPageProps) => {
  const { data: concert } = useConcert(initialConcert, initialConcert.id)
  const { data: profiles } = useProfiles()
  const { data: session } = useSession()
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
  const fanIds = concert?.bands_seen && new Set(concert.bands_seen.map(item => item.user_id))
  const fanProfiles = profiles?.filter(profile => fanIds?.has(profile.id))
  const { push } = useRouter()
  const pathname = usePathname()

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
            <Link href={`/${concertQueryState ?? ''}`} className="btn btn-link">
              <ArrowLeftIcon className="h-icon" />
              Zurück zu Konzerte
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
            <div>
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
              {concert.bands && (
                <BandList
                  bands={concert.bands}
                  bandsSeen={concert.bands_seen?.filter(item => item.user_id === session?.user.id)}
                  concertId={concert.id}
                />
              )}
            </div>
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-icon text-slate-300" />
                <div>
                  <span>
                    {new Date(concert.date_start).toLocaleDateString('de-CH', dateFormat)}
                    {concert.date_end && concert.is_festival && <>&nbsp;&ndash; </>}
                  </span>
                  {concert.date_end && concert.is_festival && (
                    <span>
                      {new Date(concert.date_end).toLocaleDateString('de-CH', dateFormat)}
                    </span>
                  )}
                </div>
              </div>
              {concert.location && (
                <div className="flex gap-4 items-center">
                  <MapPinIcon className="h-icon text-slate-300" />
                  <div>{concert.location.name}, {concert.location.city}</div>
                </div>
              )}
              {fanProfiles && fanProfiles.length > 0 && (
                <div className="flex flex-wrap gap-4">
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
