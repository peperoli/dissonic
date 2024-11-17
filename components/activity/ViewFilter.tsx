'use client'

import { useQueryState } from 'nuqs'
import { SegmentedControl } from '../controls/SegmentedControl'
import { BookUserIcon, UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const ViewFilter = () => {
  const t = useTranslations('ViewFilter')
  const viewItems = [
    { value: 'friends', label: t('friends'), icon: BookUserIcon },
    { value: 'user', label: t('you'), icon: UserIcon },
  ]
  const [selectedView, setSelectedView] = useQueryState('view', {
    defaultValue: 'friends',
    shallow: false,
  })

  return (
    <SegmentedControl options={viewItems} value={selectedView} onValueChange={setSelectedView} />
  )
}
