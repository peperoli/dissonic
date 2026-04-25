'use client'

import useMediaQuery from '@/hooks/helpers/useMediaQuery'
import { ReactNode, useRef } from 'react'
import { Dialog } from './Dialog'
import type { DialogTitleProps, DialogTriggerProps } from './Dialog'
import { useAnimate, useDragControls, useMotionValue } from 'framer-motion'
import { MotionDiv } from '../helpers/motion'

export function DrawerTrigger({
  children,
  ...props
}: { children: ReactNode } & DialogTriggerProps) {
  return (
    <button type="button" {...props}>
      {children}
    </button>
  )
}

export function DrawerTitle({ children, ...props }: { children: ReactNode } & DialogTitleProps) {
  return <Dialog.Title {...props}>{children}</Dialog.Title>
}

export function Drawer({ children, trigger }: { children: ReactNode; trigger: ReactNode }) {
  const [scope, animate] = useAnimate()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const controls = useDragControls()
  const y = useMotionValue(0)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  async function handleClose(close: () => void) {
    animate(scope.current, { opacity: [1, 0] })

    const yStart = typeof y.get() === 'number' ? y.get() : 0
    const height = modalRef.current?.offsetHeight || 0

    if (modalRef.current) {
      await animate(modalRef.current, { y: [yStart, isDesktop ? '10%' : height] })
    }
    
    close()
  }

  return (
    <Dialog.Root>
      {({ isOpen, close }) => (
        <>
          <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content>
              {isOpen && (
                <MotionDiv
                  ref={scope}
                  onClick={() => handleClose(close)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 md:items-start md:p-16"
                >
                  <MotionDiv
                    ref={modalRef}
                    onClick={e => e.stopPropagation()}
                    initial={{ y: isDesktop ? '10%' : '100%' }}
                    animate={{ y: '0%' }}
                    style={{ y }}
                    transition={{ ease: 'easeInOut' }}
                    onDragEnd={() => {
                      if (y.get() > 100) {
                        handleClose(close)
                      }
                    }}
                    drag="y"
                    dragControls={controls}
                    dragListener={false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 1 }}
                    className="mx-auto mt-auto flex h-[75vh] w-full flex-col content-start bg-slate-800 px-6 pb-6 md:mt-16 md:h-fit md:max-h-full md:max-w-md md:rounded-lg md:p-8"
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
                </MotionDiv>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </>
      )}
    </Dialog.Root>
  )
}
