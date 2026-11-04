'use client'

import {
  createContext,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ButtonSlot } from '../helpers/slots'
import { Portal } from '../helpers/Portal'

const PopoverContext = createContext<{
  id: string
  popoverRef: RefObject<HTMLDialogElement | null>
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  show: () => void
  close: () => void
  shouldCloseOnClickOutside?: boolean
} | null>(null)

function usePopoverContext() {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error('Popover components must be used within a Popover.Root')
  }

  return context
}

export function Popover({
  isOpen: controlledIsOpen,
  setOpen: controlledSetOpen,
  shouldCloseOnClickOutside = true,
  children,
}: {
  isOpen?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  shouldCloseOnClickOutside?: boolean
  children:
    | ((args: { isOpen: boolean; show: () => void; close: () => void }) => ReactNode)
    | ReactNode
}) {
  const popoverRef = useRef<HTMLDialogElement>(null)
  const [internalOpen, internalSetOpen] = useState(false)
  const isOpen = controlledIsOpen ?? internalOpen
  const setOpen = controlledSetOpen ?? internalSetOpen
  const id = useId()

  function show() {
    popoverRef.current?.show()
  }

  function close() {
    popoverRef.current?.close()
  }

  // useLayoutEffect(() => {
  //   if (popoverRef.current?.open && !isOpen) {
  //     close()
  //   } else if (!popoverRef.current?.open && isOpen) {
  //     show()
  //   }
  // }, [isOpen])

  return (
    <PopoverContext.Provider
      value={{
        popoverRef,
        id,
        isOpen,
        setOpen,
        show,
        close,
        shouldCloseOnClickOutside,
      }}
    >
      {typeof children === 'function' ? children({ isOpen, show, close }) : children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  asChild,
  ...props
}: HTMLAttributes<HTMLButtonElement> &
  ({ asChild?: false } | { asChild: true; children: ReactNode })) {
  const { id, isOpen, show, close } = usePopoverContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return (
    <Composition
      type="button"
      onClick={isOpen ? close : show}
      style={{ anchorName: `--${id}` }}
      {...props}
    />
  )
}

function PopoverContent({
  side = 'bottom',
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDialogElement>, 'children'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ((params: { close: () => void }) => ReactNode) | ReactNode
}) {
  const { popoverRef, id, close, isOpen, setOpen, shouldCloseOnClickOutside } = usePopoverContext()

  return (
    <dialog
      ref={popoverRef}
      closedby={shouldCloseOnClickOutside ? 'any' : 'closerequest'}
      // open={isOpen}
      onToggle={event => setOpen(event.currentTarget.open)}
      style={{ positionAnchor: `--${id}`, positionArea: side, positionTryFallbacks: 'flip-block' }}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </dialog>
  )
}

function PopoverClose({
  asChild,
  ...props
}: Omit<HTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> &
  ({ asChild?: false } | { asChild: true; children: ReactNode })) {
  const { close } = usePopoverContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return <Composition type="button" onClick={close} {...props} />
}

Popover.Root = Popover
Popover.Trigger = PopoverTrigger
Popover.Portal = Portal
Popover.Content = PopoverContent
Popover.Close = PopoverClose
