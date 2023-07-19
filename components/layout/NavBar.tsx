'use client'

import Link from 'next/link'
import Logo from './Logo'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon, UserGroupIcon, UserIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useLogOut } from '../../hooks/useLogOut'
import { useUser } from '../../hooks/useUser'
import { useProfile } from '../../hooks/useProfile'
import { useAvatar } from '../../hooks/useAvatar'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const NavBar = () => {
  const { data: user } = useUser()
  const { data: profile } = useProfile(user?.id)
  const { data: avatarUrl } = useAvatar(profile?.avatar_path)
  const pendingInvites = (profile?.friends && profile.friends[0].count) || 0
  const logOutMutation = useLogOut()
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {
    if (logOutMutation.status === 'success') {
      queryClient.invalidateQueries(['user'])
      router.push('/login')
    }
  }, [logOutMutation.status])
  return (
    <nav className="flex justify-between items-center p-4 md:px-12 md:py-8">
      <Link href="/">
        <Logo />
      </Link>
      {profile ? (
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-3 cursor-pointer group">
            {profile.username}
            <div className="relative flex justify-center items-center w-10 h-10 rounded-full bg-blue-300 ring-4 ring-transparent group-hover:ring-slate-600">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile picture"
                  fill={true}
                  className="rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-icon text-slate-850" />
              )}
            </div>
          </Menu.Button>
          <Menu.Items className="absolute w-40 right-0 mt-1 p-2 rounded-lg bg-slate-600 shadow-lg z-30">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push(`/users/${profile.username}`)}
                  className={`flex items-center gap-2 w-full px-2 py-1 rounded${
                    active ? ' bg-slate-500' : ''
                  }`}
                >
                  <UserIcon className="h-icon text-slate-300" />
                  Profil
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push(`/users/${profile.username}/friends`)}
                  className={`flex items-center gap-2 w-full px-2 py-1 rounded${
                    active ? ' bg-slate-500' : ''
                  }`}
                >
                  <UserGroupIcon className="h-icon text-slate-300" />
                  Freunde
                  {pendingInvites > 0 && (
                    <div className="flex justify-center items-center px-2 py-0.5 rounded font-bold text-[0.625rem] text-slate-850 bg-venom  shadow-shine shadow-venom/50">
                      {pendingInvites}
                    </div>
                  )}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex items-center gap-2 w-full px-2 py-1 rounded text-left${
                    active ? ' bg-slate-500' : ''
                  }`}
                  onClick={() => logOutMutation.mutate()}
                >
                  <ArrowRightOnRectangleIcon className="h-icon text-slate-300" />
                  Abmelden
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Link href="/login" className="btn btn-secondary">
          Anmelden
        </Link>
      )}
    </nav>
  )
}
