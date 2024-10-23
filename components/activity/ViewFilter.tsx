'use client'

import { useQueryState } from 'nuqs'
import { SegmentedControl } from '../controls/SegmentedControl'
import { BookUserIcon, UserIcon } from 'lucide-react'

export const viewItems = [
  { value: 'friends', label: 'Freunde', icon: BookUserIcon },
  { value: 'user', label: 'Du', icon: UserIcon },
]

export const ViewFilter = () => {
  const [selectedView, setSelectedView] = useQueryState('view', {
    defaultValue: 'friends',
    shallow: false,
  })
  return (
    <SegmentedControl options={viewItems} value={selectedView} onValueChange={setSelectedView} />
  )
}
