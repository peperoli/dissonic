'use client'

import { Popover } from './Popover'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'

export function Tooltip({
  children,
  content,
  triggerOnClick = false,
  ...props
}: {
  children: ReactNode
  content: ReactNode
  triggerOnClick?: boolean
}) {
  if (triggerOnClick) {
    return (
      <Popover.Root>
        {({ open, close }) => (
          <>
            <Popover.Trigger asChild onMouseOver={open} onMouseLeave={close}>
              {children}
            </Popover.Trigger>
            <Popover.Content
              side="top"
              className="z-30 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm text-white shadow-lg"
              {...props}
            >
              {content}
            </Popover.Content>
          </>
        )}
      </Popover.Root>
    )
  }

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={2}
          className="z-30 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg"
          {...props}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
