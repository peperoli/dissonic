'use client'

import { UserMinusIcon, UserPlusIcon } from 'lucide-react'
import { Button } from '../Button'
import { useModal } from '../shared/ModalProvider'
import { Tables } from '@/types/supabase'
import { useTranslations } from 'next-intl'

export function ToggleFriendButton({ friend }: { friend: Tables<'friends'> | null }) {
  const [_, setModal] = useModal()
  const t = useTranslations('ToggleFriendButton')
  const isFriend = !!friend && !friend.pending

  return (
    <Button
      onClick={() => (isFriend ? setModal('delete-friend') : setModal('add-friend'))}
      label={isFriend ? t('removeFriend') : t('addFriend')}
      contentType="icon"
      icon={
        isFriend ? (
          <UserMinusIcon className="size-icon" />
        ) : (
          <UserPlusIcon className="size-icon" />
        )
      }
      disabled={!!friend?.pending}
      appearance='tertiary'
      danger={isFriend}
    />
  )
}
