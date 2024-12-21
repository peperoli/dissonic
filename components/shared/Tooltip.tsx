'use client'

import * as Popover from '@radix-ui/react-popover'
import { ReactNode, useState } from 'react'

export function Tooltip({
  children,
  content,
  ...props
}: { children: ReactNode; content: ReactNode } & Pick<
  Popover.PopoverContentProps,
  'side' | 'sideOffset'
>) {
  const [isOpen, setIsOpen] = useState(false)

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
          className="z-10 max-w-72 rounded-lg border border-slate-800 bg-slate-900 p-2 text-sm shadow-lg"
          {...props}
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
