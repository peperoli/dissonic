'use client'

import { Provider } from '@radix-ui/react-tooltip'

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider delayDuration={200}>{children}</Provider>
)
