'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { UserIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../models/types'
import supabase from '../../utils/supabase'

export const FriendItem = ({ friend }: { friend: Profile }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function downloadAvatar() {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(friend.avatar_path)

        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        } else {
          console.error('Unexpected error', error)
        }
      }
    }

    if (friend?.avatar_path) {
      downloadAvatar()
    }
  }, [friend])
  return (
    <Link
      href={`/users/${friend.username}`}
      className="col-span-full md:col-span-1 flex items-center gap-2 p-4 rounded-lg bg-slate-800"
    >
      <div className="relative flex-shrink-0 flex justify-center items-center w-8 h-8 rounded-full bg-blue-300">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profilbild"
            fill={true}
            className="rounded-full object-cover"
          />
        ) : (
          <UserIcon className="h-icon text-slate-850" />
        )}
      </div>
      {friend.username}
    </Link>
  )
}
