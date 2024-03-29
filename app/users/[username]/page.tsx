import { ProfilePage } from '../../../components/profile/ProfilePage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import { Profile } from '../../../types/types'
import { notFound } from 'next/navigation'

async function fetchData(username: string) {
  const supabase = createClient(cookies())

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, friends!receiver_id(count)')
    .eq('username', username)
    .eq('friends.pending', true)
    .single()

  if (error) {
    throw error
  }

  return { profile }
}

type PageProps = {
  params: {
    username: string
  }
}

export default async function Page({ params }: PageProps) {
  const { profile } = await fetchData(params.username)

  if (!profile) notFound()

  return <ProfilePage initialProfile={profile} />
}
