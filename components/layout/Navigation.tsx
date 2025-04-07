'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  link: string
  name: string
}

const NavLink = ({ link, name }: NavLinkProps) => {
  const pathname = usePathname()
  const isCurrent = pathname === link
  return (
    <Link
      href={link}
      className={clsx(
        'relative rounded-lg p-4 font-bold md:py-2',
        isCurrent
          ? 'text-venom'
          : 'text-white hover:bg-slate-800 hover:text-white md:text-slate-300'
      )}
    >
      {name}
      {isCurrent && (
        <span className="absolute bottom-0 left-4 right-4 block h-0.5 bg-venom md:bottom-2 md:left-0 md:right-auto md:top-2 md:h-auto md:w-0.5" />
      )}
    </Link>
  )
}

export function Navigation() {
  const t = useTranslations('Navigation')

  return (
    <nav className="sticky top-0 z-20 -ml-4 flex flex-none overflow-auto bg-slate-850 px-4 md:top-auto md:z-0 md:w-48 md:flex-col md:p-8">
      <NavLink link="/" name={t('concerts')} />
      <NavLink link="/bands" name={t('bands')} />
      <NavLink link="/locations" name={t('locations')} />
      <NavLink link="/activity" name={t('activity')} />
      <NavLink link="/users" name={t('fans')} />
    </nav>
  )
}
