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
import { useConcert } from '../../hooks/concerts/useConcert'
import { ConcertContext } from '../../hooks/concerts/useConcertContext'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { BandSeen, Concert } from '../../types/types'
import { Button } from '../Button'
import { PageWrapper } from '../layout/PageWrapper'
import { Comments } from './Comments'
import { DeleteConcertModal } from './DeleteConcertModal'
import { EditConcertForm } from './EditConcertForm'
import { GenreChart } from './GenreChart'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { UserItem } from '../shared/UserItem'
import { BandList } from './BandList'

interface ConcertPageProps {
  initialConcert: Concert
  concertQueryState?: string
}

export const ConcertPage = ({ initialConcert, concertQueryState }: ConcertPageProps) => {
  const { data: concert } = useConcert(initialConcert, initialConcert.id)
  const fanIds = concert?.bands_seen
    ? new Set(concert.bands_seen.map(item => item.user_id))
    : new Set([])
  const { data: profiles } = useProfiles({ ids: [...fanIds] })
  const fanProfiles = profiles?.filter(profile => fanIds?.has(profile.id))
  const { data: session } = useSession()
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
  const { push } = useRouter()
  const pathname = usePathname()

  if (!concert) {
    return (
      <PageWrapper>
        <h1>Konzert nicht gefunden</h1>
      </PageWrapper>
    )
  }

  function getBandCountsPerUser(bandsSeen: BandSeen[]) {
    const counts = new Map<string, number>()
    bandsSeen.forEach(item => {
      if (counts.has(item.user_id)) {
        counts.set(item.user_id, counts.get(item.user_id)! + 1)
      } else {
        counts.set(item.user_id, 1)
      }
    })
    return counts
  }
  const bandCountsPerUser = concert.bands_seen && getBandCountsPerUser(concert.bands_seen)

  return (
    <PageWrapper>
      <ConcertContext.Provider value={{ concert }}>
        <main className="container grid gap-4">
          <div className="flex items-center justify-between">
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
          <div className="grid gap-4 rounded-lg bg-slate-800 p-4 md:p-6">
            <div>
              {concert.name || concert.festival_root_id ? (
                <div>
                  {concert.is_festival && <p>Festival</p>}
                  <h1>
                    {concert.festival_root
                      ? concert.festival_root.name +
                        ' ' +
                        new Date(concert.date_start).getFullYear()
                      : concert.name}
                  </h1>
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
            <div className="mt-4 grid gap-4">
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
                <div className="flex items-center gap-4">
                  <MapPinIcon className="h-icon text-slate-300" />
                  <div>
                    {concert.location.name}, {concert.location.city}
                  </div>
                </div>
              )}
              {fanProfiles && fanProfiles.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {fanProfiles.map(item => {
                    const count = bandCountsPerUser?.get(item.id)
                    return (
                      <Link href={`/users/${item.id}`} className="group/user-item" key={item.id}>
                        <UserItem
                          user={item}
                          description={count ? `${count} Band${count > 1 ? 's' : ''}` : null}
                        />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          {concert.bands && (
            <div className="rounded-lg bg-slate-800 p-4 md:p-6">
              <GenreChart bands={concert.bands} />
            </div>
          )}
          <div className="rounded-lg bg-slate-800 p-4 md:p-6">
            <Comments />
          </div>
          <EditConcertForm isOpen={editIsOpen} setIsOpen={setEditIsOpen} />
          <DeleteConcertModal isOpen={deleteIsOpen} setIsOpen={setDeleteIsOpen} />
        </main>
      </ConcertContext.Provider>
    </PageWrapper>
  )
}
