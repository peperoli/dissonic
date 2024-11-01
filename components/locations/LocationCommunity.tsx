'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { getConcertName } from '@/lib/getConcertName'
import * as Dialog from '@radix-ui/react-dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Band, Location, Profile } from '../../types/types'
import { MotionDiv } from '../helpers/motion'
import { UserItem } from '../shared/UserItem'
import { useBandProfiles } from '@/hooks/bands/useBandProfiles'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { useLocationProfiles } from '@/hooks/locations/useLocationProfiles'
import { getUniqueObjects } from '@/lib/getUniqueObjects'

function LocationUserItem({
  location,
  profile,
  count,
}: {
  location: Location
  profile: Profile
  count: number
}) {
  const { data: bandsSeen } = useBandsSeen({ userId: profile.id, locationId: location.id })
  const concerts = getUniqueObjects(
    bandsSeen?.map(item => item.concert).filter(concert => !!concert) ?? []
  )
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
        <UserItem
          user={profile}
          description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`}
        />
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
              className="flex h-[75vh] w-full flex-col content-start bg-slate-800 p-6 md:h-fit md:max-h-full md:max-w-sm md:rounded-lg md:p-8"
            >
              <div className="mb-6 flex w-full justify-center bg-slate-800 md:hidden">
                <button
                  aria-label="Griff"
                  onPointerDown={e => controls.start(e)}
                  className="h-2 w-12 cursor-grab touch-none rounded bg-slate-500 active:cursor-grabbing"
                />
              </div>
              <div className="sr-only mb-4 mt-8 flex items-start justify-between gap-4">
                <Dialog.Title className="mb-0">
                  {profile.username} hat {count} Konzert(e) @ {location.name} gesehen
                </Dialog.Title>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <UserItem
                  user={profile}
                  description={`${count} ${count > 1 ? 'Konzerte' : 'Konzert'}`}
                />
                <Link href={`/users/${profile.username}`} className="btn btn-secondary btn-small">
                  Profil anzeigen
                </Link>
              </div>
              <div className="relative -mb-6 overflow-y-auto pb-6">
                <ul className="grid gap-2">
                  {concerts
                    ?.sort(
                      (a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
                    )
                    .map(item => (
                      <li key={item.id}>
                        <Link href={`/concerts/${item.id}`} className="font-bold hover:underline">
                          {getConcertName(item)}
                        </Link>
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

export function LocationCommunity({ location }: { location: Location }) {
  const { data: locationProfiles, status: locationProfilesStatus } = useLocationProfiles(
    location.id
  )

  if (locationProfilesStatus === 'pending') {
    return <p>Lade ...</p>
  }

  if (locationProfiles?.length === 0 || locationProfilesStatus === 'error') {
    return null
  }

  return (
    <section className="rounded-lg bg-slate-800 p-4 md:p-6">
      <h2>Community</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {locationProfiles
          .filter(item => !!item.profile && !!item.count)
          .sort((a, b) => b.count! - a.count!)
          .map(item => (
            <LocationUserItem
              profile={item.profile!}
              count={item.count!}
              location={location}
              key={item.profile?.id}
            />
          ))}
      </div>
    </section>
  )
}
