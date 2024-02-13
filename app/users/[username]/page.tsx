import { ProfilePage } from '../../../components/profile/ProfilePage'
import { cookies } from 'next/headers'
import { createClient } from '../../../utils/supabase/server'
import { Profile } from '../../../types/types'

async function fetchData(username: string): Promise<{ profile: Profile }>{
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
  
  // @ts-expect-error
  return { profile }
}

type PageProps = {
  params: {
    username: string
  }
}

export default async function Page({ params }: PageProps) {
  const { profile } = await fetchData(params.username)
  return <ProfilePage initialProfile={profile} />
}
