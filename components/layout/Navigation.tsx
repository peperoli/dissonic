'use client'

import clsx from 'clsx'
import { Activity, ActivityIcon, CalendarIcon, LucideIcon, UsersIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const NavItem = ({
  link,
  matchingPaths,
  label,
  Icon,
}: {
  link: string
  matchingPaths?: string[]
  label: string
  Icon: LucideIcon
}) => {
  const pathname = usePathname()
  const isCurrent = matchingPaths?.includes(pathname) || pathname === link
  return (
    <Link
      href={link}
      className={clsx(
        'relative flex flex-1 flex-col items-center gap-1 rounded-lg p-3 md:flex-auto md:py-2',
        isCurrent ? 'text-venom' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      )}
    >
      <Icon className="size-icon" />
      <span className="text-xs md:text-base md:font-bold">{label}</span>
      {isCurrent && (
        <span className="absolute bottom-0 left-4 right-4 hidden h-1 bg-venom md:bottom-2 md:left-0 md:right-auto md:top-2 md:block md:h-auto md:w-0.5" />
      )}
    </Link>
  )
}

export function Navigation() {
  const t = useTranslations('Navigation')

  return (
    <nav className="fixed bottom-0 z-20 flex w-full overflow-auto bg-slate-850 px-4 md:top-auto md:z-0 md:-ml-4 md:w-48 md:flex-none md:flex-col md:p-8">
      <NavItem
        link="/concerts"
        matchingPaths={['/concerts/past', '/concerts/future']}
        label={t('concerts')}
        Icon={CalendarIcon}
      />
      <NavItem link="/activity" label={t('activity')} Icon={ActivityIcon} />
      <NavItem link="/users" label={t('fans')} Icon={UsersIcon} />
    </nav>
  )
}
