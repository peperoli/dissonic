import React, { FC, ReactNode } from 'react'

interface TableProps {
  children: ReactNode
}

export const Table: FC<TableProps> = ({ children }) => {
  return <div className="grid gap-px p-4 rounded-xl bg-slate-800">{children}</div>
}
