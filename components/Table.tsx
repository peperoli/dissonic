import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
}

export const Table = ({ children }: TableProps) => {
  return (
    <div className="-mx-4 grid gap-px md:rounded-2xl bg-radial-gradient from-blue/20 via-slate-800 to-slate-800 p-4 md:mx-auto">
      {children}
    </div>
  )
}
