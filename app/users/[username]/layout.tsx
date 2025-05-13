import { SpeedDial } from '@/components/layout/SpeedDial'
import { Header } from '@/components/profile/Header'
import { Score } from '@/components/profile/Score'
import { TabLink } from '@/components/profile/TabLink'
import { getAssetUrl } from '@/lib/getAssetUrl'
import { createClient } from '@/utils/supabase/server'
import { ResolvingMetadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> },
  parent: ResolvingMetadata
) {
  const { username } = await params
  const t = await getTranslations('ProfileLayout')
  const { profile } = await fetchData(username)
  const avatarUrl = getAssetUrl('avatars', profile.avatar_path, profile.updated_at)
  const parentImages = (await parent).openGraph?.images || []

  return {
    title: t('title', { username }),
    openGraph: {
      images: avatarUrl ? [avatarUrl] : parentImages,
    },
  }
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: friend } = await supabase
    .from('friends')
    .select('*')
    .or(`sender_id.eq.${user?.id}, receiver_id.eq.${user?.id}`)
    .or(`sender_id.eq.${profile.id}, receiver_id.eq.${profile.id}`)
    .single()

  return { profile, user, friend }
}

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ username: string }>
}>) {
  const { username } = await params
  const { profile, user, friend } = await fetchData(username)
  const t = await getTranslations('ProfileLayout')

  const tabs = [
    { href: `/users/${username}/stats`, label: t('stats') },
    { href: `/users/${username}/concerts`, label: t('concerts') },
    { href: `/users/${username}/friends`, label: t('friends') },
    { href: `/users/${username}/activity`, label: t('activity') },
    { href: `/users/${username}/contributions`, label: t('contributions') },
  ]

  return (
    <main className="container grid gap-4">
      <Header profile={profile} user={user} friend={friend} />
      <Score profileId={profile.id} />
      <div className="mb-4 overflow-x-auto rounded-lg bg-slate-700 px-3">
        <nav className="flex">
          {tabs.map(tab => (
            <TabLink {...tab} key={tab.href} />
          ))}
        </nav>
      </div>
      {children}
      <SpeedDial />
    </main>
  )
}
