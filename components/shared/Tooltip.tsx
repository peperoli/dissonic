'use client'

import { createContext, HTMLAttributes, ReactNode, useContext } from 'react'
import { Portal } from '../helpers/Portal'
import { ButtonSlot } from '../helpers/slots'
import { autoUpdate, shift, useFloating } from '@floating-ui/react-dom'

const TooltipContext = createContext<{
  toggle: () => void
  show: () => void
  hide: () => void
  floating: ReturnType<typeof useFloating>
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
  const floating = useFloating({
    placement: 'top',
    strategy: 'absolute',
    whileElementsMounted: autoUpdate,
    middleware: [shift()],
  })

  async function toggle() {
    floating.elements.floating?.togglePopover()
  }

  async function show() {
    floating.elements.floating?.showPopover()
  }
  async function hide() {
    floating.elements.floating?.hidePopover()
  }

  return (
    <TooltipContext.Provider
      value={{
        toggle,
        show,
        hide,
        floating,
      }}
    >
      <TooltipTrigger asChild shouldToggleOnClick={shouldToggleOnClick}>
        {children}
      </TooltipTrigger>
      <Portal>
        <TooltipContent className="z-30 mb-0.5 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg">
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
  const { toggle, show, hide, floating } = useTooltipContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return (
    <Composition
      type="button"
      onClick={shouldToggleOnClick ? toggle : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      ref={floating.refs.setReference}
      {...props}
    />
  )
}

function TooltipContent({
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode
}) {
  const { floating } = useTooltipContext()

  return (
    <div ref={floating.refs.setFloating} popover="auto" style={floating.floatingStyles} {...props}>
      {children}
    </div>
  )
}
