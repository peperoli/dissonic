import clsx from 'clsx'
import { ReactNode } from 'react'

type CellProps = {
  children: ReactNode
  type?: 'text' | 'number' | 'date'
}

export function Cell({ children, type = 'text' }: CellProps) {
  return (
    <td
      className={clsx(
        'p-2 pr-6',
        type === 'number' && 'font-mono text-right',
        type === 'date' && 'text-center'
      )}
    >
      {children}
    </td>
  )
}