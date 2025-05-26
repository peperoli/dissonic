'use client'

import Link from 'next/link'
import Logo from './Logo'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useLogOut } from '../../hooks/auth/useLogOut'
import { useProfile } from '../../hooks/profiles/useProfile'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from '../../hooks/auth/useSession'
import { UserItem } from '../shared/UserItem'
import { ArrowBigUp, BookUser, LogOut, SearchIcon, User } from 'lucide-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useModal } from '../shared/ModalProvider'
import LogoHorns from './LogoHorns'
import useMediaQuery from '@/hooks/helpers/useMediaQuery'

export const NavBar = () => {
  const { data: session } = useSession()
  const { data: profile } = useProfile(session?.user.id ?? null)
  const pendingInvites = (profile?.friends && profile.friends[0].count) || 0
  const logOutMutation = useLogOut()
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const [_, setModal] = useModal()
  const pathname = usePathname()
  const t = useTranslations('NavBar')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (logOutMutation.status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      push('/login')
    }
  }, [logOutMutation.status])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.shiftKey && event.key === 'F') {
        event.preventDefault()
        setModal('search')
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const menuItems = [
    {
      label: t('profile'),
      icon: User,
      href: `/users/${profile?.username}`,
    },
    {
      label: t('friends'),
      icon: BookUser,
      href: `/users/${profile?.username}/friends`,
      badge: pendingInvites,
    },
    {
      label: t('logout'),
      icon: LogOut,
      onClick: () => logOutMutation.mutate(),
    },
  ]
  return (
    <nav className="container-fluid flex items-center gap-6">
      <Link href="/" className="flex-shrink-0 md:w-40">
        {isDesktop ? <Logo /> : <LogoHorns />}
      </Link>
      <button
        onClick={() => setModal('search')}
        className="flex w-full max-w-96 items-center gap-3 rounded-lg border border-slate-500 bg-white/5 px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-venom"
      >
        <SearchIcon className="size-icon" />
        <span className="text-slate-300">{t('search')}</span>
        <span className="ml-auto hidden items-center rounded border border-slate-500 px-1 py-0.5 text-sm text-slate-500 md:flex">
          <ArrowBigUp className="size-icon" />+ F
        </span>
      </button>
      {profile ? (
        <Menu as="div" className="relative ml-auto flex-shrink-0">
          <MenuButton className="group/user-item">
            <UserItem user={profile} avatarRight usernameIsHidden={!isDesktop} />
          </MenuButton>
          <MenuItems className="absolute right-0 z-30 mt-1 w-40 rounded-lg bg-slate-700 p-2 shadow-xl">
            {menuItems.map((item, index) => {
              const ConditionalWrapper = item.href ? Link : 'button'
              const Icon = item.icon
              return (
                <MenuItem key={index}>
                  {({ focus }) => (
                    <ConditionalWrapper
                      href={item.href!}
                      onClick={item.onClick}
                      className={clsx(
                        'flex w-full items-center gap-2 rounded px-2 py-1',
                        focus && 'bg-slate-600'
                      )}
                    >
                      <Icon className="size-icon text-slate-300" />
                      {item.label}
                      {!!item.badge && item.badge > 0 && (
                        <span className="min-w-4 rounded bg-venom px-1 text-center text-sm text-slate-850">
                          {item.badge}
                        </span>
                      )}
                    </ConditionalWrapper>
                  )}
                </MenuItem>
              )
            })}
          </MenuItems>
        </Menu>
      ) : (
        <div className="flex gap-4 ml-auto">
          <Link href="/signup" className="btn btn-tertiary max-md:hidden">
            {t('signUp')}
          </Link>
          <Link href={`/login?redirect=${pathname}`} className="btn btn-secondary">
            {t('login')}
          </Link>
        </div>
      )}
    </nav>
  )
}
