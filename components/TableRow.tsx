import Link from "next/link"
import React, { FC, ReactNode } from "react"

interface TableRowProps {
  children: ReactNode
  href?: string
}

export const TableRow: FC<TableRowProps> = ({ children, href }) => {
  let gridCols = 'md:grid-cols-1'
  const WrapperTag = href ? Link : 'div'

  switch (Array.isArray(children) && children.length) {
    case 2:
      gridCols = 'md:grid-cols-2'
      break
    case 3:
      gridCols = 'md:grid-cols-3'
      break
  }
  return (
    <WrapperTag href={href || '#'} className={`grid items-center px-3 py-2 rounded-md hover:bg-slate-700 ${gridCols}`}>
      {children}
    </WrapperTag>
  )
}