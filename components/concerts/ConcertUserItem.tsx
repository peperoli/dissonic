'use client'

import { useBands } from '@/hooks/bands/useBands'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { getConcertName } from '@/lib/getConcertName'
import * as Dialog from '@radix-ui/react-dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Concert, Profile } from '../../types/types'
import { MotionDiv } from '../helpers/motion'
import { UserItem } from '../shared/UserItem'

export function ConcertUserItem({
  concert,
  user,
  count,
}: {
  concert: Concert
  user: Profile
  count: number
}) {
  const bandsSeen = concert.bands_seen?.filter(item => typeof item !== 'undefined')
  const { data: bands } = useBands(undefined, {
    ids: bandsSeen?.filter(item => item.user_id === user.id).map(item => item.band_id),
  })
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-16 md:items-start"
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
                  {user.username} hat {count} Band(s) am Konzert {getConcertName(concert)} gesehen
                </Dialog.Title>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <UserItem
                  user={user}
                  description={count ? `${count} Band${count > 1 ? 's' : ''}` : null}
                />
                <Link href={`/users/${user.username}`} className="btn btn-secondary btn-small">
                  Profil anzeigen
                </Link>
              </div>
              <div className="relative -mb-6 overflow-y-auto pb-6">
                <ul>{bands?.data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
              </div>
            </MotionDiv>
          </Dialog.Content>
        </MotionDiv>
      </Dialog.Overlay>
    </Dialog.Root>
  )
}
