'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Friend, Profile } from '../../types/types'
import supabase from '../../utils/supabase/client'
import { Button } from '../Button'
import { UserItem } from '../shared/UserItem'

type InviteItemType = {
  inviteData: Friend
  type: 'sent' | 'received'
}

const InviteItem = ({ inviteData, type }: InviteItemType) => {
  const [invite, setInvite] = useState<Friend | null>(inviteData)
  const profile = type === 'sent' ? invite?.receiver : invite?.sender

  async function cancelInvite() {
    if (!invite) return
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('sender_id', invite.sender.id)
        .eq('receiver_id', invite.receiver.id)

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
    if (!invite) return
    try {
      const { error } = await supabase
        .from('friends')
        .update({ pending: false, accepted_at: new Date().toISOString() })
        .eq('sender_id', invite.sender.id)
        .eq('receiver_id', invite.receiver.id)

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
        <Link href={`/users/${profile.username}`}>
          <UserItem user={profile} />
        </Link>
        <div className="flex gap-2 md:ml-auto">
          {type === 'sent' ? (
            <Button onClick={cancelInvite} label="Anfrage zurückziehen" size="small" />
          ) : (
            <>
              <Button onClick={cancelInvite} label="Ablehnen" size="small" />
              <Button
                onClick={confirmInvite}
                label="Bestätigen"
                size="small"
                appearance="primary"
              />
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

export const FriendInvites = ({ profile, friends }: IFriendInvites) => {
  const sentInvites = friends.filter(item => item.pending && item.sender.id === profile.id)
  const receivedInvites = friends.filter(item => item.pending && item.receiver.id === profile.id)
  return (
    <div className="col-span-full rounded-lg bg-slate-800 p-6">
      <h2 className="sr-only">Freundschaftsanfragen</h2>
      <div className="mb-6 grid gap-4">
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
