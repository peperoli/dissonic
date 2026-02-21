import { Dialog, type DialogProps } from './shared/Dialog'
import clsx from 'clsx'
import { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  fullHeight?: boolean
  closeOnClickOutside?: boolean
} & Pick<DialogProps, 'isOpen' | 'setOpen'>

export const Modal = ({ children, fullHeight, closeOnClickOutside, ...props }: ModalProps) => {
  return (
    <Dialog.Root {...props}>
      {({ close }) => (
        <Dialog.Portal>
          <Dialog.Content
            id="modal"
            shouldCloseOnClickOutside
            onClick={event =>
              closeOnClickOutside && (event.target as HTMLDialogElement).id === 'modal' && close()
            }
            className={clsx(
              'pointer-events-none inset-0 z-50 justify-center overflow-auto backdrop:pointer-events-auto backdrop:bg-black/75 open:flex',
              !fullHeight && 'items-start'
            )}
          >
            <div className="pointer-events-auto mx-auto min-h-full w-full max-w-lg bg-slate-800 p-6 md:m-16 md:min-h-0 md:rounded-lg md:p-8">
              {children}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}
