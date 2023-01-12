import React from 'react'
import { ProfilePage } from '../../../components/profile/ProfilePage'
import supabase from '../../../utils/supabase'

export const revalidate = 0

async function fetchData(username) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  const { data: bandsSeen } = await supabase
    .from('j_bands_seen')
    .select(
      `
        *, 
        concert:concerts(id, date_start, location:locations(*), is_festival),
        band:bands(*, genres(*))
      `
    )
    .eq('user_id', profile.id)

  const { data: friends } = await supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)')
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)

  return { profile, bandsSeen, friends }
}

export default async function Page({ params }) {
  const { profile, bandsSeen, friends } = await fetchData(params.username)
  return <ProfilePage profileData={profile} bandsSeen={bandsSeen || []} friends={friends || []} />
}
