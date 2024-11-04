'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Friend } from '../../types/types'
import supabase from '../../utils/supabase/client'
import { Button } from '../Button'
import { UserItem } from '../shared/UserItem'

type InviteItemType = {
  inviteData: Friend
  type: 'sent' | 'received'
}

export const InviteItem = ({ inviteData, type }: InviteItemType) => {
  const [invite, setInvite] = useState<Friend | null>(inviteData)
  const profile = type === 'sent' ? invite?.receiver : invite?.sender

  async function cancelInvite() {
    if (!invite) return
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('sender_id', invite.sender_id)
        .eq('receiver_id', invite.receiver_id)

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
        .eq('sender_id', invite.sender_id)
        .eq('receiver_id', invite.receiver_id)

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
        <div className="flex w-full gap-2 md:ml-auto md:w-fit">
          {type === 'sent' ? (
            <Button onClick={cancelInvite} label="Anfrage zurückziehen" size="small" block />
          ) : (
            <>
              <Button onClick={cancelInvite} label="Ablehnen" size="small" block danger />
              <Button onClick={confirmInvite} label="Bestätigen" size="small" block />
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}
