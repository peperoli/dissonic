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
  popoverRef: RefObject<HTMLDivElement | null>
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
  shouldCloseOnClickOutside = true,
  children,
}: {
  shouldCloseOnClickOutside?: boolean
  children:
    | ((args: { isOpen: boolean; show: () => void; close: () => void }) => ReactNode)
    | ReactNode
}) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)
  const id = useId()

  function show() {
    popoverRef.current?.showPopover()
  }

  function close() {
    popoverRef.current?.hidePopover()
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
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ((params: { close: () => void }) => ReactNode) | ReactNode
}) {
  const { popoverRef, id, close, setOpen, shouldCloseOnClickOutside } = usePopoverContext()

  return (
    <div
      ref={popoverRef}
      popover={shouldCloseOnClickOutside ? 'auto' : 'manual'}
      onToggle={event => setOpen(event.newState === 'open')}
      style={{ positionAnchor: `--${id}`, positionArea: side, positionTryFallbacks: 'flip-block' }}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </div>
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
