import { ReactNode } from 'react'

export const CommaSeperatedList = ({ children }: { children?: ReactNode[] }) => {
  return children?.map((child, index) => (
    <div key={index}>
      {child}
      {index + 1 !== children.length &&
        (index + 2 === children.length ? (
          <span className="text-slate-300">&nbsp;und</span>
        ) : (
          <span className="text-slate-300">,</span>
        ))}
    </div>
  ))
}
