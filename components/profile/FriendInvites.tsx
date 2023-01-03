'use client'

import { UserIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { Friend, Invite, Profile } from '../../models/types'
import supabase from '../../utils/supabase'
import { Button } from '../Button'

const InviteItem = ({ inviteData, type }: { inviteData: Invite; type: 'sent' | 'received' }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [invite, setInvite] = useState<Invite | null>(inviteData)
  const profile = type === 'sent' ? invite?.receiver : invite?.sender

  useEffect(() => {
    async function downloadAvatar() {
      if (profile) {
        try {
          const { data, error } = await supabase.storage
            .from('avatars')
            .download(profile.avatar_path)

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

    if (profile?.avatar_path) {
      downloadAvatar()
    }
  }, [profile])

  async function cancelInvite() {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('sender_id', invite?.sender.id)
        .eq('receiver_id', invite?.receiver.id)

      if (error) {
        throw error
      }

      setInvite(null)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Unexpected error', error)
      }
    }
  }

  async function confirmInvite() {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ pending: false, accepted_at: new Date() })
        .eq('sender_id', invite?.sender.id)
        .eq('receiver_id', invite?.receiver.id)

      if (error) {
        throw error
      }

      setInvite(null)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Unexpected error', error)
      }
    }
  }

  if (invite && profile) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Link href={`/users/${profile.username}`} className="flex items-center gap-2 basis-full md:basis-auto">
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
          {profile.username}
        </Link>
        <div className="flex gap-2 md:ml-auto">
          {type === 'sent' ? (
            <Button onClick={cancelInvite} label="Anfrage zurückziehen" size="small" />
          ) : (
            <>
              <Button onClick={cancelInvite} label="Ablehnen" size="small" />
              <Button onClick={confirmInvite} label="Bestätigen" size="small" style="primary" />
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}

interface IFriendInvites {
  profile: Profile
  friends: Friend[]
}

export const FriendInvites: FC<IFriendInvites> = ({
  profile,
  friends
}) => {
  const [user, setUser] = useState<any | null>(null)

  const sentInvites = friends.filter(item => item.pending && item.sender.id === profile.id)
  const receivedInvites = friends.filter(item => item.pending && item.receiver.id === profile.id)
  
  useEffect(() => {
    async function getUser() {
      const {
        data: { user: userData },
      } = await supabase.auth.getUser()
      if (userData) {
        setUser(userData)
      }
    }

    getUser()
  }, [])

  if (user?.id === profile.id) {
    return (
      <div className="col-span-full p-6 rounded-lg bg-slate-800">
        <h2 className="sr-only">Freundschaftsanfragen</h2>
        <div className="grid gap-4 mb-6">
          <h3 className="text-slate-300">Empfangene Anfragen</h3>
          {receivedInvites.length > 0 ? (
            receivedInvites.map(item => (
              <InviteItem key={item.sender.id} inviteData={item} type="received" />
            ))
          ) : (
            <p className="text-sm text-slate-300">Du hast keine ausstehende Anfragen.</p>
          )}
        </div>
        <div className="grid gap-4">
          <h3 className="text-slate-300">Gesendete Anfragen</h3>
          {sentInvites.length > 0 ? (
            sentInvites.map(item => (
              <InviteItem key={item.receiver.id} inviteData={item} type="sent" />
            ))
          ) : (
            <p className="text-sm text-slate-300">Du hast keine ausstehende Anfragen.</p>
          )}
        </div>
      </div>
    )
  }

  return null
}
