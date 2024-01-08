import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { Dispatch, FC, ReactNode, SetStateAction } from 'react'

interface ModalProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  children: ReactNode
  fullHeight?: boolean
}

export const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, children, fullHeight }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 z-50" />
        <Dialog.Content
          className={clsx(
            'fixed flex justify-center inset-0 overflow-auto z-50',
            !fullHeight && 'items-start'
          )}
        >
          <div className="mx-auto w-full max-w-lg min-h-full md:min-h-0 md:m-16 p-8 md:rounded-lg bg-slate-800">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
