'use client'

import * as Popover from '@radix-ui/react-popover'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactNode, useState } from 'react'

export function Tooltip({
  children,
  content,
  triggerOnClick = false,
  ...props
}: {
  children: ReactNode
  content: ReactNode
  triggerOnClick?: boolean
} & Pick<Popover.PopoverContentProps, 'side' | 'sideOffset'>) {
  const [isOpen, setIsOpen] = useState(false)

  if (triggerOnClick) {
    return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger
          asChild
          onMouseOver={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side={props.side ?? 'top'}
            sideOffset={props.sideOffset ?? 2}
            className="z-30 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg"
            {...props}
          >
            {content}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={props.side ?? 'top'}
          sideOffset={props.sideOffset ?? 2}
          className="z-30 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg"
          {...props}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
