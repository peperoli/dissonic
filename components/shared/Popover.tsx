import {
  createContext,
  Dispatch,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { ButtonSlot } from '../helpers/slots'

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
  const { id, isOpen, show } = usePopoverContext()
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

export function PopoverPortal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.body
    setMounted(true)
  }, [])

  return mounted && ref.current ? createPortal(children, ref.current) : children
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
      style={{ positionAnchor: `--${id}`, positionArea: side }}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </dialog>
  )
}

function PopoverClose({
  asChild,
  ...props
}: HTMLAttributes<HTMLButtonElement> &
  ({ asChild?: false } | { asChild: true; children: ReactElement })) {
  const { close } = usePopoverContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return <Composition type="button" onClick={close} {...props} />
}

Popover.Root = Popover
Popover.Trigger = PopoverTrigger
Popover.Portal = PopoverPortal
Popover.Content = PopoverContent
Popover.Close = PopoverClose
