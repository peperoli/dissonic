import { ProfilePage } from '../../../components/profile/ProfilePage'
import { createClient } from '../../../utils/supabase/server'
import supabase from '../../../utils/supabase/client'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const { data: profiles, error } = await supabase.from('profiles').select('username')

  if (error) {
    throw error
  }

  return profiles?.map(profile => ({ username: profile.username }))
}

async function fetchData(username: string) {
  const supabase = createClient()

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
