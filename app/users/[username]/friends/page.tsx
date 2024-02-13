import { FriendsPage } from '../../../../components/profile/FriendsPage'
import { cookies } from 'next/headers'
import React from 'react'
import { createClient } from '../../../../utils/supabase/server'
import { Friend, Profile } from '../../../../types/types';

async function fetchData(username: string): Promise<{ profile: Profile; friends: Friend[] }> {
  const supabase = createClient(cookies())

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data: friends, error } = await supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)')
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  if (error) {
    throw error
  }

  // @ts-expect-error
  return { profile, friends }
}

type PageProps = {
  params: {
    username: string
  }
}

export default async function Page({ params }: PageProps) {
  const { profile, friends } = await fetchData(params.username)
  return <FriendsPage profile={profile} initialFriends={friends} />
}
