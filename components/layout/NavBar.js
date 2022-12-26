"use client"

import Link from "next/link";
import Logo from "./Logo";
import supabase from "../../utils/supabase";
import { Menu } from '@headlessui/react'
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon, UserGroupIcon, UserIcon } from "@heroicons/react/20/solid"
import Image from "next/image";
import { useState, useEffect } from "react";

export default function NavBar() {
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
  
        if (user) {
          const { data: profile, error: profileError, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
  
          if (profileError) {
            throw profileError
          }
  
          if (profile && status !== 406) {
            setProfile(profile)
          }
        }
      } catch (error) {
        alert(error.message)
      }
    }

    getProfile()
  }, [])

  useEffect(() => {
    async function downloadAvatar() {
      try {
        const {data, error} = await supabase.storage.from('avatars').download(profile.avatar_path)
    
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.error(error.message)
      }
    }

    if (profile?.avatar_path) {
      downloadAvatar()
    }
  }, [profile])

  async function signOut() {
    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      setProfile(null)
      router.push('/')
    } catch (error) {
      alert(error.message)
    }
  }
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
                  className={`flex gap-2 w-full px-2 py-1 rounded${active ? ' bg-slate-500' : ''}`}
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
                  className={`flex gap-2 w-full px-2 py-1 rounded${active ? ' bg-slate-500' : ''}`}
                >
                  <UserGroupIcon className="h-icon text-slate-300" />
                  Freunde
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`flex gap-2 w-full px-2 py-1 rounded text-left${
                    active ? ' bg-slate-500' : ''
                  }`}
                  onClick={signOut}
                >
                  <ArrowRightOnRectangleIcon className="h-icon text-slate-300" />
                  Abmelden
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <Link href="/login" className="btn btn-secondary">Anmelden</Link>
      )}
    </nav>
  )
}