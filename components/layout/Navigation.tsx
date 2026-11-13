'use client'

import clsx from 'clsx'
import {
  ActivityIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  GuitarIcon,
  HomeIcon,
  LucideIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Popover } from '../shared/Popover'

const NavItem = ({
  link,
  matchingPaths,
  isHome,
  label,
  Icon,
  className,
}: {
  link: string
  matchingPaths?: string[]
  isHome?: boolean
  label: string
  Icon: LucideIcon
  className?: string
}) => {
  const pathname = usePathname()
  const isCurrent = isHome
    ? pathname === link
    : matchingPaths?.includes(pathname) || pathname.startsWith(link)
  return (
    <Link
      href={link}
      className={clsx(
        'relative flex flex-1 flex-col items-center gap-1 rounded-lg p-3 md:-ml-4 md:flex-auto md:flex-row md:gap-3 md:px-4 md:py-2',
        isCurrent ? 'text-venom' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        className
      )}
    >
      <Icon className="size-icon" />
      <span className={clsx('text-xs md:text-base md:font-bold', isCurrent && 'font-bold')}>
        {label}
      </span>
      {isCurrent && (
        <span className="absolute bottom-0 left-4 right-4 hidden h-1 bg-venom md:bottom-2 md:left-0 md:right-auto md:top-2 md:block md:h-auto md:w-1 md:rounded-r" />
      )}
    </Link>
  )
}

export function Navigation() {
  const t = useTranslations('Navigation')

  return (
    <nav className="fixed bottom-0 z-20 flex w-full overflow-auto bg-slate-850 px-4 md:relative md:top-auto md:z-0 md:w-48 md:flex-none md:flex-col md:self-start md:p-8">
      <NavItem link="/" isHome label={t('home')} Icon={HomeIcon} className="md:hidden" />
      <NavItem
        link="/concerts"
        matchingPaths={['/concerts/past', '/concerts/future']}
        label={t('concerts')}
        Icon={CalendarIcon}
      />
      <NavItem link="/bands" label={t('bands')} Icon={GuitarIcon} className="max-md:hidden" />
      <NavItem
        link="/locations"
        label={t('locations')}
        Icon={MapPinIcon}
        className="max-md:hidden"
      />
      <NavItem link="/activity" label={t('activity')} Icon={ActivityIcon} />
      <NavItem link="/users" label={t('fans')} Icon={UsersIcon} />
      <Popover.Root>
        <Popover.Trigger className="relative flex flex-1 flex-col items-center gap-1 rounded-lg p-3 text-slate-300 md:hidden">
          <EllipsisVerticalIcon className="size-icon" />
          <span className="text-xs md:text-base md:font-bold">{t('more')}</span>
        </Popover.Trigger>
        <Popover.Content className="z-30 mt-2 rounded-lg bg-slate-850 p-2 text-white shadow-xl">
          <NavItem link="/bands" label={t('bands')} Icon={GuitarIcon} />
          <NavItem link="/locations" label={t('locations')} Icon={MapPinIcon} />
        </Popover.Content>
      </Popover.Root>
    </nav>
  )
}
