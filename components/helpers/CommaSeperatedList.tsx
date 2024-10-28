'use client'

import { ReactNode, useState } from 'react'

export const CommaSeperatedList = ({ children }: { children?: ReactNode[] }) => {
  const [visibleChildren, setVisibleChildren] = useState(3)
  return (
    <>
      {children?.slice(0, visibleChildren).map((child, index) => (
        <div key={index}>
          {child}
          {index + 1 !== children.length &&
            (index + 2 === children.length ? (
              <span className="text-slate-300">&nbsp;und</span>
            ) : (
              <span className="text-slate-300">,</span>
            ))}
        </div>
      ))}
      {children?.length && children.length > visibleChildren && (
        <button
          type="button"
          onClick={() => setVisibleChildren(children.length)}
          className="rounded-md bg-slate-700 px-1 text-slate-300 hover:bg-slate-600"
        >
          +{children.length - visibleChildren}
        </button>
      )}
    </>
  )
}
