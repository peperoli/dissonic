import { cookies } from 'next/headers'
import { HomePage } from '../../components/concerts/HomePage'
import { Concert } from '../../types/types'
import { createClient } from '../../utils/supabase/server'

async function fetchData(view: string = 'past;global') {
  const supabase = await createClient()
  const concertsView = view.split(';')[0]
  const userView = view.split(';')[1]

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let { data: concertIds, error: concertIdsError } = await supabase
    .from('concerts_full')
    .select('id, date_start, bands_seen:j_bands_seen(user_id)')

  if (!concertIds) {
    throw concertIdsError
  }

  if (concertsView === 'past') {
    concertIds = concertIds.filter(
      concert => concert.date_start && new Date(concert.date_start) < new Date()
    )
  } else if (concertsView === 'future') {
    concertIds = concertIds.filter(
      concert => concert.date_start && new Date(concert.date_start) > new Date()
    )
  }

  if (user && concertsView !== 'future') {
    if (userView === 'user') {
      concertIds = concertIds.filter(concert =>
        concert.bands_seen.find(band => band.user_id === user.id)
      )
    } else if (userView === 'friends') {
      const { data: friends, error: friendsError } = await supabase
        .from('friends')
        .select(
          `*,
          sender:profiles!friends_sender_id_fkey(*),
          receiver:profiles!friends_receiver_id_fkey(*)`
        )
        .or(`sender_id.eq.${user.id}, receiver_id.eq.${user.id}`)

      if (friendsError) {
        throw friendsError
      }

      const friendIds = [
        ...new Set([
          ...friends.map(item => item.sender_id),
          ...friends.map(item => item.receiver_id),
        ]),
      ]

      concertIds = concertIds.filter(concert =>
        concert.bands_seen.find(band => friendIds?.includes(band.user_id))
      )
    }
  }

  const { data, count, error } = await supabase
    .from('concerts_full')
    .select('*, bands:j_concert_bands(*, ...bands(*, genres(*)))', { count: 'estimated' })
    .in(
      'id',
      concertIds.map(concert => concert.id)
    )
    .order('date_start', { ascending: concertsView === 'future' })
    .order('item_index', { referencedTable: 'j_concert_bands', ascending: true })
    .limit(25)
    .limit(5, { referencedTable: 'j_concert_bands' })
    .overrideTypes<Concert[]>()

  if (error) {
    throw error
  }

  return { concerts: { data, count }, user }
}

export default async function Page() {
  const cookieStore = await cookies()
  const view = cookieStore.get('view')?.value
  const { concerts, user } = await fetchData(view)

  return (
    <HomePage
      concerts={concerts}
      currentUser={user}
      view={{ concerts_view: view?.split(';')[0], user_view: view?.split(';')[1] }}
    />
  )
}
