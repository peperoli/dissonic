'use client'

import {
  createContext,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ButtonSlot } from '../helpers/slots'
import { Portal } from '../helpers/Portal'

const DialogContext = createContext<{
  dialogRef: RefObject<HTMLDialogElement | null>
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  show: () => void
  close: () => void
  shouldCloseOnClickOutside?: boolean
} | null>(null)

function useDialogContext() {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('Dialog components must be used within a Dialog.Root')
  }

  return context
}

export type DialogProps = {
  isOpen?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  shouldCloseOnClickOutside?: boolean

  children:
    | ((args: { isOpen: boolean; show: () => void; close: () => void }) => ReactNode)
    | ReactNode
}

export function Dialog({
  isOpen: controlledIsOpen,
  setOpen: controlledSetOpen,
  shouldCloseOnClickOutside,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [internalOpen, internalSetOpen] = useState(false)
  const isOpen = controlledIsOpen ?? internalOpen
  const setOpen = controlledSetOpen ?? internalSetOpen

  function show() {
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  useLayoutEffect(() => {
    if (dialogRef.current?.open && !isOpen) {
      close()
    } else if (!dialogRef.current?.open && isOpen) {
      show()
    }
  }, [isOpen])

  return (
    <DialogContext.Provider
      value={{
        dialogRef,
        isOpen,
        setOpen,
        show,
        close,
        shouldCloseOnClickOutside,
      }}
    >
      {typeof children === 'function'
        ? children({ isOpen, show, close })
        : children}
    </DialogContext.Provider>
  )
}

export type DialogTriggerProps = HTMLAttributes<HTMLButtonElement> &
  ({ asChild?: false } | { asChild: true; children: ReactNode })

export function DialogTrigger({ asChild, ...props }: DialogTriggerProps) {
  const { show } = useDialogContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return <Composition type="button" onClick={show} {...props} />
}

export function DialogContent({
  children,
  ...props
}: HTMLAttributes<HTMLDialogElement> & {
  children: ReactNode
}) {
  const { dialogRef, setOpen, shouldCloseOnClickOutside } = useDialogContext()

  return (
    <dialog
      ref={dialogRef}
      // @ts-expect-error
      closedby={shouldCloseOnClickOutside ? 'any' : undefined}
      onToggle={event => setOpen(event.currentTarget.open)}
      {...props}
    >
      {children}
    </dialog>
  )
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: string
  children: ReactNode
}

export function DialogTitle({ as, children, ...props }: DialogTitleProps) {
  const HeadingTag = as ? as : 'h2'

  return <HeadingTag {...props}>{children}</HeadingTag>
}

export function DialogClose({
  asChild,
  ...props
}: Omit<HTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> &
  ({ asChild?: false } | { asChild: true; children: ReactNode })) {
  const { close } = useDialogContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return <Composition type="button" onClick={close} {...props} />
}

Dialog.Root = Dialog
Dialog.Trigger = DialogTrigger
Dialog.Portal = Portal
Dialog.Content = DialogContent
Dialog.Title = DialogTitle
Dialog.Close = DialogClose
