'use client'

import { setConcertsRangePreference } from '@/actions/preferences'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

export function ConcertsNav() {
  const [_, startTransition] = useTransition()
  const t = useTranslations('ConcertsNav')

  function handleClick(value: 'past' | 'future') {
    startTransition(async () => {
      await setConcertsRangePreference(value)
    })
  }

  return (
    <nav className="flex bg-slate-850 px-4 md:px-0 md:w-fit md:mb-4">
      <NavItem link="/concerts/past" name={t('past')} onClick={() => handleClick('past')} />
      <NavItem link="/concerts/future" name={t('future')} onClick={() => handleClick('future')} />
    </nav>
  )
}

function NavItem({ link, name, onClick }: { link: string; name: string, onClick?: () => void }) {
  const pathname = usePathname()
  const isCurrent = pathname === link
  return (
    <Link
      href={link}
      onClick={onClick}
      className={clsx(
        'relative rounded-lg p-3 font-bold md:py-2 flex-1 md:flex-auto text-center',
        isCurrent
          ? 'text-venom'
          : 'hover:bg-slate-800 hover:text-white text-slate-300'
      )}
    >
      {name}
      {isCurrent && (
        <span className="absolute bottom-0 left-0 right-0 block h-1 rounded-t bg-venom" />
      )}
    </Link>
  )
}
