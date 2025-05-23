'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavItem({ link, name, onClick }: { link: string; name: string, onClick?: () => void }) {
  const pathname = usePathname()
  const isCurrent = pathname === link
  return (
    <Link
      href={link}
      onClick={onClick}
      className={clsx(
        'relative rounded-lg p-3 font-bold md:py-2 flex-1 text-center',
        isCurrent
          ? 'text-venom'
          : 'text-white hover:bg-slate-800 hover:text-white md:text-slate-300'
      )}
    >
      {name}
      {isCurrent && (
        <span className="absolute bottom-0 left-0 right-0 block h-0.5 bg-venom md:bottom-2 md:left-0 md:right-auto md:top-2 md:h-auto md:w-0.5" />
      )}
    </Link>
  )
}
