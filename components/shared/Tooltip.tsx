'use client'

import {
  createContext,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { usePopper } from 'react-popper'
import { Portal } from '../helpers/Portal'
import { ButtonSlot } from '../helpers/slots'

const TooltipContext = createContext<{
  toggle: () => void
  setReferenceElement: Dispatch<SetStateAction<HTMLButtonElement | null>>
  setPopperElement: Dispatch<SetStateAction<HTMLDivElement | null>>
  popperStyles: ReturnType<typeof usePopper>['styles']
  popperAttributes: ReturnType<typeof usePopper>['attributes']
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
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const { update, styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  })

  async function toggle() {
    popperElement?.togglePopover()
    update?.()
  }

  return (
    <TooltipContext.Provider
      value={{
        toggle,
        setReferenceElement,
        setPopperElement,
        popperStyles: styles,
        popperAttributes: attributes,
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
  const { toggle, setReferenceElement } = useTooltipContext()
  const Composition = asChild ? ButtonSlot : 'button'

  return (
    <Composition
      type="button"
      onClick={shouldToggleOnClick ? toggle : undefined}
      onMouseEnter={toggle}
      onMouseLeave={toggle}
      ref={setReferenceElement}
      {...props}
    />
  )
}

function TooltipContent({
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ((params: { close: () => void }) => ReactNode) | ReactNode
}) {
  const { setPopperElement, popperStyles, popperAttributes } = useTooltipContext()

  return (
    <div
      ref={setPopperElement}
      popover="auto"
      style={popperStyles.popper}
      {...popperAttributes.popper}
      {...props}
    >
      {typeof children === 'function' ? children({ close }) : children}
    </div>
  )
}
