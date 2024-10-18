import { ActivityItem } from '@/components/activity/ActivityItem'
import { LoadMoreButton } from '@/components/contributions/LoadMoreButton'
import { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'

type Concert = Pick<Tables<'concerts'>, 'id' | 'name' | 'date_start'> & {
  festival_root: Pick<Tables<'festival_roots'>, 'id' | 'name'>
  location: Pick<Tables<'locations'>, 'id' | 'name'>
  bands: Pick<Tables<'bands'>, 'id' | 'name'>[]
}

export type CommentActivityItemT = Tables<'comments'> & {
  user: Tables<'profiles'>
  concert: Concert
}

export type BandSeenActivityItemT = Tables<'j_bands_seen'> & {
  created_at: string
  user: Tables<'profiles'>
  band: Pick<Tables<'bands'>, 'id' | 'name'>
  concert: Concert
}

export type FriendAcitivityItemT = Tables<'friends'> & {
  sender: Tables<'profiles'>
  receiver: Tables<'profiles'>
}

export type ActivityItemT = CommentActivityItemT | BandSeenActivityItemT | FriendAcitivityItemT

async function fetchData({ searchParams }: { searchParams: { size?: string } }) {
  const supabase = createClient()
  const concertCols = `
    id,
    name,
    date_start,
    festival_root:festival_roots(id, name),
    location:locations(id, name),
    bands!j_concert_bands(id, name)
  `

  const commentsQuery = supabase
    .from('comments')
    .select(`*, user:comments_user_id_fkey(*), concert:concerts(${concertCols})`, {
      count: 'estimated',
    })
    .order('created_at', { ascending: false })
    .returns<CommentActivityItemT[]>()

  const bandsSeenQuery = supabase
    .from('j_bands_seen')
    .select(`*, user:profiles(*), band:bands(id, name), concert:concerts(${concertCols})`, {
      count: 'estimated',
    })
    .not('created_at', 'is', null)
    .order('created_at', { ascending: false })
    .returns<BandSeenActivityItemT[]>()

  const friendsQuery = supabase
    .from('friends')
    .select('*, sender:sender_id(*), receiver:receiver_id(*)', { count: 'estimated' })
    .is('pending', false)
    .order('created_at', { ascending: false })
    .returns<FriendAcitivityItemT[]>()

  const [commentsRes, bandsSeenRes, friendsRes] = await Promise.all([
    commentsQuery,
    bandsSeenQuery,
    friendsQuery,
  ])

  if (commentsRes.error) {
    throw commentsRes.error
  }

  if (bandsSeenRes.error) {
    throw bandsSeenRes.error
  }

  if (friendsRes.error) {
    throw friendsRes.error
  }

  return {
    comments: commentsRes.data,
    commentsCount: commentsRes.count || 0,
    bandsSeen: bandsSeenRes.data,
    bandsSeenCount: bandsSeenRes.count || 0,
    friends: friendsRes.data,
    friendsCount: friendsRes.count || 0,
  }
}

export default async function ActivityPage({ searchParams }: { searchParams: { size?: string } }) {
  const { comments, commentsCount, bandsSeen, bandsSeenCount, friends, friendsCount } =
    await fetchData({ searchParams })
  const items = [...comments, ...bandsSeen, ...friends].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const itemsCount = commentsCount + bandsSeenCount + friendsCount
  const groupedItems = groupByDate(items)

  function groupByDate(items: ActivityItemT[]) {
    return items.reduce<{ date: string; items: ActivityItemT[] }[]>((acc, item) => {
      const date = new Date(item.created_at).toLocaleDateString('de-CH', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      if (!acc.find(group => group.date === date)) {
        acc.push({ date, items: [] })
      }
      acc.find(group => group.date === date)?.items.push(item)
      return acc
    }, [])
  }

  return (
    <main className="container">
      <h1>Aktivität</h1>
      {items.length === 0 && (
        <p className="mb-4 text-slate-300">Keine Aktivität für diesen User gefunden.</p>
      )}
      <div className="grid gap-6">
        {groupedItems.map(group => (
          <section key={group.date}>
            <h2 className="h3">{group.date}</h2>
            <ul className="grid gap-2">
              {group.items.map((item, index) => (
                <ActivityItem key={index} activityItem={item} />
              ))}
            </ul>
          </section>
        ))}
        {items.length !== itemsCount && <LoadMoreButton />}
      </div>
    </main>
  )
}
