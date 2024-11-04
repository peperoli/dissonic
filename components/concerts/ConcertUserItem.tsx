'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { getConcertName } from '@/lib/getConcertName'
import * as Dialog from '@radix-ui/react-dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Band, Concert, Profile } from '../../types/types'
import { MotionDiv } from '../helpers/motion'
import { UserItem } from '../shared/UserItem'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'
import Image from 'next/image'
import { GuitarIcon } from 'lucide-react'

function BandItem({ band }: { band: Band }) {
  const { data: spotifyArtist } = useSpotifyArtist(band.spotify_artist_id)
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })

  return (
    <Link
      href={`/bands/${band.id}`}
      className="flex gap-4 rounded-lg p-2 text-left hover:bg-slate-700"
    >
      <div className="relative grid h-11 w-11 flex-none place-content-center rounded-lg bg-slate-750">
        {spotifyArtist?.images?.[2] ? (
          <Image
            src={spotifyArtist.images[2].url}
            alt={band.name}
            fill
            sizes="150px"
            className="rounded-lg object-cover"
          />
        ) : (
          <GuitarIcon className="size-icon text-slate-300" />
        )}
      </div>
      <div className="w-full">
        {band.name}
        {band.country?.iso2 && (
          <div className="text-sm text-slate-300">{regionNames.of(band.country.iso2)}</div>
        )}
      </div>
    </Link>
  )
}

export function ConcertUserItem({
  concert,
  user,
  count,
}: {
  concert: Concert
  user: Profile
  count: number
}) {
  const bandsSeenIds = concert.bands_seen
    ?.filter(item => item.user_id === user.id)
    .map(item => item.band_id)
  const bands = concert.bands?.filter(item => bandsSeenIds?.includes(item.id))
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
        <UserItem user={user} description={count ? `${count} Band${count > 1 ? 's' : ''}` : null} />
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
                  {user.username} hat {count} Band(s) am Konzert {getConcertName(concert)} gesehen
                </Dialog.Title>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <UserItem
                  user={user}
                  description={count ? `${count} Band${count > 1 ? 's' : ''}` : null}
                />
                <Link href={`/users/${user.username}`} className="btn btn-secondary btn-small">
                  Profil anzeigen
                </Link>
              </div>
              <div className="relative -mb-6 overflow-y-auto pb-6 pt-4 md:-mb-8 md:pb-8">
                <ul className="grid">
                  {bands
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    .map(item => (
                      <li key={item.id}>
                        <BandItem band={item} />
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
