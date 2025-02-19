'use client'

import { useQueryState } from 'nuqs'
import { SegmentedControl } from '../controls/SegmentedControl'
import { BookUserIcon, GlobeIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSession } from '@/hooks/auth/useSession'

export const ViewFilter = () => {
  const { data: session } = useSession()
  const t = useTranslations('ViewFilter')
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'

  const viewItems = [
    isMod ? { value: 'global', label: t('all'), icon: GlobeIcon } : null,
    { value: 'friends', label: t('friends'), icon: BookUserIcon },
    { value: 'user', label: t('you'), icon: UserIcon },
  ].filter(item => item !== null)
  const [selectedView, setSelectedView] = useQueryState('view', {
    defaultValue: isMod ? 'global' : 'friends',
    shallow: false,
  })

  return (
    <SegmentedControl options={viewItems} value={selectedView} onValueChange={setSelectedView} />
  )
}
