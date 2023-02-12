import Link from "next/link"
import React, { FC, ReactNode } from "react"

interface TableRowProps {
  children: ReactNode
  href?: string
}

export const TableRow: FC<TableRowProps> = ({ children, href }) => {
  const WrapperTag = href ? Link : 'div'
  return (
    <WrapperTag href={href || '#'} className={`flex md:items-center gap-4 px-3 py-2 rounded-md hover:bg-slate-700`}>
      {children}
    </WrapperTag>
  )
}