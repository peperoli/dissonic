import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { ProfilePage } from '../../../components/profile/ProfilePage'
import { cookies } from 'next/headers'

async function fetchData(username: string) {
  const supabase = createServerComponentClient({ cookies })

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, friends!receiver_id(count)')
    .eq('username', username)
    .eq('friends.pending', true)
    .single()

  if (error) {
    throw error
  }

  const { data: bandsSeen, error: bandsSeenError } = await supabase
    .from('j_bands_seen')
    .select(
      `
        *, 
        concert:concerts(id, date_start, location:locations(*), is_festival),
        band:bands(*, genres(*))
      `
    )
    .eq('user_id', profile.id)

  if (bandsSeenError) {
    throw bandsSeenError
  }

  const { data: friends, error: friendsError } = await supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)')
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  if (friendsError) {
    throw friendsError
  }

  return { profile, bandsSeen, friends }
}

type PageProps = {
  params: {
    username: string
  }
}

export default async function Page({ params }: PageProps) {
  const { profile, bandsSeen, friends } = await fetchData(params.username)
  return (
    <ProfilePage initialProfile={profile} bandsSeen={bandsSeen || []} friends={friends || []} />
  )
}
