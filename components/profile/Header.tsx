'use client'

import { UserItem } from '@/components/shared/UserItem'
import { EditProfileButton } from '@/components/profile/EditProfileButton'
import { ToggleFriendButton } from '@/components/profile/ToggleFriendButton'
import { ShareButton } from '@/components/shared/ShareButton'
import { Tooltip } from '@/components/shared/Tooltip'
import { CheckCircleIcon, Settings } from 'lucide-react'
import Link from 'next/link'
import { Profile } from '@/types/types'
import { useProfile } from '@/hooks/profiles/useProfile'
import { User } from '@supabase/supabase-js'
import { Tables } from '@/types/supabase'
import { useTranslations } from 'next-intl'

export function Header({
  profile: initialProfile,
  user,
  friend,
}: {
  profile: Profile
  user: User | null
  friend: Tables<'friends'> | null
}) {
  const { data: profile } = useProfile(initialProfile.id, null, initialProfile)
  const t = useTranslations('ProfileLayout')
  const isOwnProfile = profile?.id === user?.id

  if (!profile) {
    return null
  }

  return (
    <header className="mb-6 flex flex-wrap items-center gap-4">
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
            <Tooltip content={t('settings')}>
              <Link
                href="/settings"
                aria-label={t('settings')}
                className="btn btn-icon btn-small btn-tertiary"
              >
                <Settings className="size-icon" />
              </Link>
            </Tooltip>
          </>
        )}
      </div>
    </header>
  )
}
