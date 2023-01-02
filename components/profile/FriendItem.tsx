'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { UserIcon, UserMinusIcon } from '@heroicons/react/20/solid'
import { Profile } from '../../models/types'
import supabase from '../../utils/supabase'
import { Button } from '../Button'
import { RemoveFriendModal } from './RemoveFriendModal'

export const FriendItem = ({ friendData }: { friendData: Profile }) => {
  const [friend, setFriend] = useState<Profile | null>(friendData)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  const avatarPath = friend ? friend.avatar_path : null

  useEffect(() => {
    async function downloadAvatar() {
      if (avatarPath) {
        try {
          const { data, error } = await supabase.storage.from('avatars').download(avatarPath)
  
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
    }

    if (avatarPath) {
      downloadAvatar()
    }
  }, [avatarPath])

  if (friend) {
    return (
      <>
        <div className="col-span-full md:col-span-1 flex items-center gap-3 justify-between p-4 rounded-lg bg-slate-800">
          <Link href={`/users/${friend.username}`} className="flex items-center gap-3">
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
          <Button
            label="Freund entfernen"
            onClick={() => setIsOpen(true)}
            contentType="icon"
            icon={<UserMinusIcon className="h-icon" />}
            size="small"
            danger
          />
        </div>
        {isOpen && <RemoveFriendModal isOpen={isOpen} setIsOpen={setIsOpen} friend={friend} setFriend={setFriend} />}
      </>
    )
  }

  return null
}
