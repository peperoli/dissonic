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
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, friends!receiver_id(count)')
    .eq('username', username)
    .eq('friends.pending', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      notFound()
    }

    throw error
  }

  return { profile }
}

type PageProps = {
  params: Promise<{
    username: string
  }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { profile } = await fetchData(params.username)

  return <ProfilePage initialProfile={profile} />
}
