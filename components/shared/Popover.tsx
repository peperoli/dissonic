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
} | null>(null)

function usePopoverContext() {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error('Popover components must be used within a Popover.Root')
  }

  return context
}

export function Popover({
  children,
}: {
  children:
    | ((args: { isOpen: boolean; show: () => void; close: () => void }) => ReactNode)
    | ReactNode
}) {
  const popoverRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setOpen] = useState(false)
  const id = useId()

  function show() {
    popoverRef.current?.show()
  }

  function close() {
    popoverRef.current?.close()
  }

  return (
    <PopoverContext.Provider
      value={{
        popoverRef,
        id,
        isOpen,
        setOpen,
        show,
        close,
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
      // @ts-expect-error
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
  const { popoverRef, id, close, setOpen } = usePopoverContext()

  return (
    <dialog
      ref={popoverRef}
      closedby="any"
      onToggle={event => setOpen(event.currentTarget.open)}
      // @ts-expect-error
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
