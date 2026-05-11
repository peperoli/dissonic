import Link from 'next/link'
import { HTMLAttributes } from 'react'

export function ConditionalLinkTag({
  children,
  onClick,
  href,
  ...props
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
} & HTMLAttributes<HTMLElement>) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} {...props}>
        {children}
      </button>
    )
  }
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return <div {...props}>{children}</div>
}
