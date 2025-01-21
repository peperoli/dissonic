import { SpeedDial } from '@/components/layout/SpeedDial'
import { EditProfileButton } from '@/components/profile/EditProfileButton'
import { Score } from '@/components/profile/Score'
import { TabLink } from '@/components/profile/TabLink'
import { ToggleFriendButton } from '@/components/profile/ToggleFriendButton'
import { ShareButton } from '@/components/shared/ShareButton'
import { UserItem } from '@/components/shared/UserItem'
import { createClient } from '@/utils/supabase/server'
import { CheckCircleIcon, Settings } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const t = await getTranslations('ProfileLayout')

  return {
    title: t('title', { username }),
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
  const isOwnProfile = profile.id === user?.id

  const tabs = [
    { href: `/users/${username}/stats`, label: t('stats') },
    { href: `/users/${username}/concerts`, label: t('concerts') },
    { href: `/users/${username}/friends`, label: t('friends') },
    { href: `/users/${username}/activity`, label: t('activity') },
    { href: `/users/${username}/contributions`, label: t('contributions') },
  ]
  return (
    <main className="container grid gap-4">
      <section className="mb-6 flex flex-wrap items-center gap-4">
        <UserItem user={profile} description={isOwnProfile ? user?.email : ''} size="lg" />
        {friend && !friend?.pending && (
          <p className="flex gap-2 text-slate-300">
            <CheckCircleIcon className="size-icon" />
            {t('friend')}
          </p>
        )}
        {!isOwnProfile && <ToggleFriendButton friend={friend} />}
        <div className="ml-auto flex gap-2">
          <ShareButton />
          {isOwnProfile && (
            <>
              <EditProfileButton />
              <Link
                href="/settings"
                aria-label={t('settings')}
                className="btn btn-icon btn-small btn-tertiary"
              >
                <Settings className="size-icon" />
              </Link>
            </>
          )}
        </div>
      </section>
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
