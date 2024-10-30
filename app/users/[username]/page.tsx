import supabase from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

export async function generateStaticParams() {
  const { data: profiles, error } = await supabase.from('profiles').select('username')

  if (error) {
    throw error
  }

  return profiles?.map(profile => ({ username: profile.username }))
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  redirect(`/users/${username}/stats`)
}
