import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { FriendsPage } from '../../../../components/profile/FriendsPage'
import { cookies } from 'next/headers'
import React from 'react'

async function fetchData(username: string) {
  const supabase = createServerComponentClient({ cookies })

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
