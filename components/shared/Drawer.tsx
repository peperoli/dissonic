'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import * as Dialog from '@radix-ui/react-dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import { ReactNode, useRef, useState, createContext, useContext } from 'react'
import { MotionDiv } from '../helpers/motion'

const DialogContext = createContext<[boolean, (value: boolean) => void]>([false, () => {}])

export function DrawerTrigger({
  children,
  ...props
}: { children: ReactNode } & Dialog.DialogTriggerProps) {
  const [_, setIsOpen] = useContext(DialogContext)
  return (
    <button type="button" aria-haspopup="dialog" onClick={() => setIsOpen(true)} {...props}>
      {children}
    </button>
  )
}

export function DrawerTitle({
  children,
  ...props
}: { children: ReactNode } & Dialog.DialogTitleProps) {
  return <Dialog.Title {...props}>{children}</Dialog.Title>
}

export function Drawer({ children, trigger }: { children: ReactNode; trigger: ReactNode }) {
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
    <DialogContext.Provider value={[isOpen, setIsOpen]}>
      <Dialog.Root>
        {trigger}
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <MotionDiv
                ref={scope}
                onClick={handleClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 md:items-start md:p-16"
              >
                <Dialog.Content forceMount asChild>
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
                    dragElastic={{ top: 0, bottom: 1 }}
                    className="flex h-[75vh] w-full flex-col content-start bg-slate-800 px-6 pb-6 md:h-fit md:max-h-full md:max-w-md md:rounded-lg md:p-8"
                  >
                    <button
                      aria-label="Griff"
                      onPointerDown={e => controls.start(e)}
                      className="flex w-full cursor-grab touch-none justify-center py-6 active:cursor-grabbing md:hidden"
                    >
                      <div className="h-2 w-12 rounded bg-slate-500" />
                    </button>
                    {children}
                  </MotionDiv>
                </Dialog.Content>
              </MotionDiv>
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </DialogContext.Provider>
  )
}
