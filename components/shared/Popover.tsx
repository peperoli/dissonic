import {
  Children,
  cloneElement,
  createContext,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  RefObject,
  useContext,
  useId,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'

const PopoverContext = createContext<{
  id: string
  popoverRef: RefObject<HTMLDialogElement | null>
  open: () => void
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
  children: ((params: { open: () => void; close: () => void }) => ReactNode) | ReactNode
}) {
  const id = useId()
  const popoverRef = useRef<HTMLDialogElement>(null)

  function open() {
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
        open,
        close,
      }}
    >
      {typeof children === 'function' ? children({ open, close }) : children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  asChild,
  ...props
}: HTMLAttributes<HTMLButtonElement> &
  ({ asChild?: false } | { asChild: true; children: ReactNode })) {
  const { id } = usePopoverContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return (
    <Composition
      type="button"
      popoverTarget={id}
      // @ts-expect-error
      style={{ anchorName: `--${id}` }}
      {...props}
    />
  )
}

function ButtonSlot({
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  if (Children.count(children) > 1) {
    throw new Error('Popover.Trigger with asChild only accepts a single child element')
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      // @ts-expect-error
      ...children.props,
    })
  }

  return null
}

function PopoverContent({
  side = 'bottom',
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ((params: { close: () => void }) => ReactNode) | ReactNode
}) {
  const { popoverRef, id, close } = usePopoverContext()

  return createPortal(
    <dialog
      ref={popoverRef}
      popover="auto"
      id={id}
      // @ts-expect-error
      style={{ positionAnchor: `--${id}`, positionArea: side }}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </dialog>,
    document.body
  )
}

Popover.Root = Popover
Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent
