'use client'

import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { SegmentedControl } from '../controls/SegmentedControl'
import { BookUserIcon, GlobeIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from '@/hooks/auth/useSession'
import { ActivityFetchOptions } from '@/types/types'

export function useView(isMod: boolean) {
  const view = ['global', 'friends', 'user'] as const
  return useQueryState('view', parseAsStringLiteral(view).withDefault(isMod ? 'global' : 'friends'))
}

export const ViewFilter = () => {
  const { data: session } = useSession()
  const t = useTranslations('ViewFilter')
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'

  const viewItems = [
    isMod ? { value: 'global', label: t('all'), icon: GlobeIcon } : null,
    { value: 'friends', label: t('friends'), icon: BookUserIcon },
    { value: 'user', label: t('you'), icon: UserIcon },
  ].filter(item => item !== null)
  const [selectedView, setSelectedView] = useView(isMod)

  return (
    <SegmentedControl
      options={viewItems}
      value={selectedView}
      onValueChange={setSelectedView as keyof ActivityFetchOptions['view']}
    />
  )
}
