'use client'

import {
  createContext,
  HTMLAttributes,
  ReactNode,
  RefObject,
  useContext,
  useId,
  useRef,
} from 'react'
import { ButtonSlot } from '../helpers/slots'
import { Portal } from '../helpers/Portal'

const TooltipContext = createContext<{
  id: string
  tooltipRef: RefObject<HTMLDivElement | null>
  toggle: () => void
} | null>(null)

function useTooltipContext() {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error('Tooltip components must be used within a Tooltip.Root')
  }

  return context
}

export function Tooltip({
  children,
  content,
  shouldToggleOnClick = false,
}: {
  children: ReactNode
  content: ReactNode
  shouldToggleOnClick?: boolean
}) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const id = useId()

  function toggle() {
    tooltipRef.current?.togglePopover()
  }

  return (
    <TooltipContext.Provider
      value={{
        tooltipRef,
        id,
        toggle,
      }}
    >
      <TooltipTrigger asChild shouldToggleOnClick={shouldToggleOnClick}>
        {children}
      </TooltipTrigger>
      <Portal>
        <TooltipContent
          side="top"
          className="z-30 mb-0.5 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg transition delay-100"
        >
          {content}
        </TooltipContent>
      </Portal>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  asChild,
  shouldToggleOnClick = false,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  shouldToggleOnClick?: boolean
  triggerOnHover?: boolean
} & ({ asChild?: false } | { asChild: true; children: ReactNode })) {
  const { id, toggle } = useTooltipContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return (
    <Composition
      type="button"
      onClick={shouldToggleOnClick ? toggle : undefined}
      onMouseEnter={toggle}
      onMouseLeave={toggle}
      // @ts-expect-error
      style={{ anchorName: `--${id}` }}
      {...props}
    />
  )
}

function TooltipContent({
  side = 'bottom',
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDialogElement>, 'children'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: ((params: { close: () => void }) => ReactNode) | ReactNode
}) {
  const { tooltipRef, id } = useTooltipContext()

  return (
    <div
      ref={tooltipRef}
      popover="auto"
      // @ts-expect-error
      style={{ positionAnchor: `--${id}`, positionArea: side }}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </div>
  )
}
