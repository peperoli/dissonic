'use client'

import Link from 'next/link'
import Logo from './Logo'
import supabase from '../../utils/supabase'
import { Menu } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { ArrowRightOnRectangleIcon, UserGroupIcon, UserIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLogOut } from '../../hooks/useLogOut'
import { useUser } from '../../hooks/useUser'
import { useProfile } from '../../hooks/useProfile'
import { useAvatar } from '../../hooks/useAvatar'

export const NavBar = () => {
  const { data: user } = useUser()
  const { data: profile } = useProfile(user?.id)
  const { data: avatarUrl} = useAvatar(profile?.avatar_path)

  const [receivedInvitesCount, setReceivedInvitesCount] = useState(0)

  const logOutMutation = useLogOut()
  const router = useRouter()

  if (logOutMutation.isSuccess) {
    router.push('/login')
  }

  useEffect(() => {
    async function getReceivedInvites() {
      try {
        const { count, error } = await supabase
          .from('friends')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', profile?.id)
          .eq('pending', true)

        if (error) {
          throw error
        }

        if (count) {
          setReceivedInvitesCount(count)
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message)
        } else {
          alert('An unexpected error has occurred')
          console.error(error)
        }
      }
    }

    if (profile) {
      getReceivedInvites()
    }
  }, [profile])
  return (
    <nav className="flex justify-between items-center p-4 md:px-12 md:py-8">
      <Link href="/">
        <Logo />
      </Link>
      {profile ? (
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-3">
            {profile.username}
            <div className="relative flex justify-center items-center w-10 h-10 rounded-full bg-blue-300">
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
                  {receivedInvitesCount > 0 && (
                    <div className="flex justify-center items-center px-2 py-0.5 rounded font-bold text-[0.625rem] text-slate-850 bg-venom  shadow-shine shadow-venom/50">
                      {receivedInvitesCount}
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
