import { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
}

export const Table = ({ children }: TableProps) => {
  return <div className="grid gap-px p-4 rounded-xl bg-radial-gradient from-blue/20 via-slate-800 to-slate-800">{children}</div>
}
