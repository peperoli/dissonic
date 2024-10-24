import { ActivityItemT } from 'app/activity/page'
import { ActivityItem } from './ActivityItem'
import { Tables } from '@/types/supabase'

export const ActivityGroup = ({
  timeGroup,
}: {
  timeGroup: { time: number; userId: string | null; items: ActivityItemT[] }
}) => {
  const bands = timeGroup.items
    .filter(item => item.type === 'j_bands_seen' && !!item.band)
    .map(item => item.band) as Tables<'bands'>[]

  if (timeGroup.items.find(item => item.type === 'j_bands_seen')) {
    return <ActivityItem activityItem={timeGroup.items[0]} bands={bands} />
  }

  return timeGroup.items.map((item, index) => <ActivityItem key={index} activityItem={item} />)
}
