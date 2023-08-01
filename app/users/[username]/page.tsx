import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
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
