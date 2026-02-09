import { createContext, HTMLAttributes, ReactNode, useContext, useState } from 'react'

const DisclosureContext = createContext<{
  isOpen: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function useDisclosureContext() {
  const context = useContext(DisclosureContext)

  if (!context) {
    throw new Error('Disclosure components must be used within a Disclosure')
  }

  return context
}

export function Disclosure({
  children,
  isOpen: controlledIsOpen,
  setOpen: controlledSetOpen,
  ...props
}: { children: ReactNode; isOpen?: boolean; setOpen?: (open: boolean) => void } & Omit<
  HTMLAttributes<HTMLDetailsElement>,
  'open' | 'onToggle'
>) {
  const [isOpen, setOpen] = useState(false)

  return (
    <DisclosureContext.Provider value={{ isOpen, setOpen }}>
      <details
        open={controlledIsOpen !== undefined ? controlledIsOpen : isOpen}
        onToggle={event =>
          controlledSetOpen
            ? controlledSetOpen(event.currentTarget.open)
            : setOpen(event.currentTarget.open)
        }
        {...props}
      >
        {children}
      </details>
    </DisclosureContext.Provider>
  )
}

export function DisclosureTrigger({
  children,
  ...props
}: {
  children: ({ isOpen }: { isOpen: boolean }) => ReactNode
} & HTMLAttributes<HTMLElement>) {
  const { isOpen } = useDisclosureContext()

  return (
    <summary data-state={isOpen ? 'open' : 'closed'} {...props}>
      {children({ isOpen })}
    </summary>
  )
}

export function DisclosureContent({
  children,
  ...props
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

Disclosure.Root = Disclosure
Disclosure.Trigger = DisclosureTrigger
Disclosure.Content = DisclosureContent
