import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { Dispatch, FC, ReactNode, SetStateAction } from 'react'

type ModalProps = {
  children: ReactNode
  fullHeight?: boolean
} & Dialog.DialogProps

export const Modal = ({ children, fullHeight, ...props }: ModalProps) => {
  return (
    <Dialog.Root {...props}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75" />
        <Dialog.Content
          className={clsx(
            'fixed inset-0 z-50 flex justify-center overflow-auto',
            !fullHeight && 'items-start'
          )}
        >
          <div className="mx-auto min-h-full w-full max-w-lg bg-slate-800 p-6 md:m-16 md:min-h-0 md:rounded-lg md:p-8">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
