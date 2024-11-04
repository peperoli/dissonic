'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import * as Dialog from '@radix-ui/react-dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Band, Profile } from '../../types/types'
import { MotionDiv } from '../helpers/motion'
import { UserItem } from '../shared/UserItem'
import { useBandProfiles } from '@/hooks/bands/useBandProfiles'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { CalendarIcon } from 'lucide-react'
import { Tables } from '@/types/supabase'

function ConcertItem({
  concert,
}: {
  concert: Tables<'concerts'> & {
    festival_root: { name: string } | null
    bands: Tables<'bands'>[] | null
    location: Tables<'locations'> | null
  }
}) {
  const { data: spotifyArtist } = useSpotifyArtist(concert.bands?.[0]?.spotify_artist_id)
  const dateStart = new Date(concert.date_start)
  const dateEnd = concert.date_end ? new Date(concert.date_end) : null
  const isSameYear = dateStart.getFullYear() === dateEnd?.getFullYear()
  const concertDate = dateEnd
    ? `${dateStart.toLocaleDateString('de-CH', {
        day: 'numeric',
        month: 'numeric',
        year: isSameYear ? undefined : 'numeric',
      })} bis ${dateEnd.toLocaleDateString()}`
    : dateStart.toLocaleDateString()
  return (
    <Link href={`/concerts/${concert.id}`} className="flex gap-4 rounded-lg p-2 hover:bg-slate-700">
      <div className="relative grid size-16 flex-none place-content-center rounded-lg bg-slate-750">
        {spotifyArtist?.images[2] ? (
          <Image
            src={spotifyArtist?.images[2].url}
            alt={concert.bands?.[0]?.name ?? ''}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <CalendarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="">
        <p className="truncate font-bold">
          {concert.festival_root?.name ||
            concert.name ||
            concert.bands
              ?.slice(0, 3)
              .map(band => band.name)
              .join(', ')}
        </p>
        <p className="text-sm">{concertDate}</p>
        <p className="text-sm text-slate-300">
          {concert.location?.name}, {concert.location?.city}
        </p>
      </div>
    </Link>
  )
}

function BandUserItem({ band, profile, count }: { band: Band; profile: Profile; count: number }) {
  const { data: bandsSeen } = useBandsSeen({ userId: profile.id, bandId: band.id })
  const concerts = bandsSeen?.map(item => item.concert).filter(concert => !!concert)
  const [isOpen, setIsOpen] = useState(false)
  const [scope, animate] = useAnimate()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const controls = useDragControls()
  const y = useMotionValue(0)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  async function handleClose() {
    animate(scope.current, { opacity: [1, 0] })

    const yStart = typeof y.get() === 'number' ? y.get() : 0
    const height = modalRef.current?.offsetHeight || 0

    if (modalRef.current) {
      await animate(modalRef.current, { y: [yStart, isDesktop ? '10%' : height] })
    }
    setIsOpen(false)
  }
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger className="group/user-item text-left">
        <UserItem user={profile} description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`} />
      </Dialog.Trigger>
      <Dialog.Overlay asChild>
        <MotionDiv
          ref={scope}
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 md:items-start md:p-16"
        >
          <Dialog.Content asChild>
            <MotionDiv
              ref={modalRef}
              onClick={e => e.stopPropagation()}
              initial={{ y: isDesktop ? '10%' : '100%' }}
              animate={{ y: '0%' }}
              style={{ y }}
              transition={{ ease: 'easeInOut' }}
              onDragEnd={() => {
                if (y.get() > 100) {
                  handleClose()
                }
              }}
              drag="y"
              dragControls={controls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.5, bottom: 0.5 }}
              className="flex h-[75vh] w-full flex-col content-start bg-slate-800 p-6 md:h-fit md:max-h-full md:max-w-md md:rounded-lg md:p-8"
            >
              <button
                aria-label="Griff"
                onPointerDown={e => controls.start(e)}
                className="mb-6 flex w-full cursor-grab touch-none justify-center bg-slate-800 active:cursor-grabbing md:hidden"
              >
                <div className="h-2 w-12 rounded bg-slate-500" />
              </button>
              <div className="sr-only mb-4 mt-8 flex items-start justify-between gap-4">
                <Dialog.Title className="mb-0">
                  {profile.username} hat {count} Konzert(e) mit {band.name} gesehen
                </Dialog.Title>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <UserItem
                  user={profile}
                  description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`}
                />
                <Link href={`/users/${profile.username}`} className="btn btn-secondary btn-small">
                  Profil anzeigen
                </Link>
              </div>
              <div className="relative -mb-6 overflow-y-auto pb-6 pt-4 md:pb-8">
                <ul className="grid">
                  {concerts
                    ?.sort(
                      (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
                    )
                    .map(item => (
                      <li key={item.id}>
                        <ConcertItem concert={item} />
                      </li>
                    ))}
                </ul>
              </div>
            </MotionDiv>
          </Dialog.Content>
        </MotionDiv>
      </Dialog.Overlay>
    </Dialog.Root>
  )
}

export function BandCommunity({ band }: { band: Band }) {
  const { data: bandProfiles, status: bandProfilesStatus } = useBandProfiles(band.id)

  if (bandProfilesStatus === 'pending') {
    return <p>Lade ...</p>
  }

  if (bandProfiles?.length === 0 || bandProfilesStatus === 'error') {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>Community</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {bandProfiles
          .filter(item => !!item.profile)
          .sort((a, b) => b.count - a.count)
          .map(item => (
            <BandUserItem
              profile={item.profile!}
              count={item.count}
              band={band}
              key={item.profile?.id}
            />
          ))}
      </div>
    </section>
  )
}
