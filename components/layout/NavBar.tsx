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
import { BookUser, LogOut, User } from 'lucide-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

export const NavBar = () => {
  const { data: session } = useSession()
  const { data: profile } = useProfile(session?.user.id ?? null)
  const pendingInvites = (profile?.friends && profile.friends[0].count) || 0
  const logOutMutation = useLogOut()
  const queryClient = useQueryClient()
  const { push } = useRouter()
  const pathname = usePathname()
  const t = useTranslations('NavBar')

  useEffect(() => {
    if (logOutMutation.status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      push('/login')
    }
  }, [logOutMutation.status])

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
    <nav className="container-fluid flex items-center justify-between">
      <Link href="/">
        <Logo />
      </Link>
      {profile ? (
        <Menu as="div" className="relative">
          <MenuButton className="group/user-item">
            <UserItem user={profile} avatarRight />
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
        <div className="flex gap-4">
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
