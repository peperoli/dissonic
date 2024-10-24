import { ContributionItem } from './ContributionItem'
import { Tables } from '@/types/supabase'

export const ContributionGroup = ({
  timeGroup,
}: {
  timeGroup: { time: number; userId: string | null; items: Tables<'contributions'>[] }
}) => {
  const bandIds = timeGroup.items
    .filter(item => item.ressource_type === 'j_concert_bands')
    .map(({ state_new, state_old }) =>
      state_new
        ? typeof state_new === 'object' && 'band_id' in state_new
          ? Number(state_new.band_id)
          : null
        : typeof state_old === 'object' && !!state_old && 'band_id' in state_old
          ? Number(state_old.band_id)
          : null
    )
    .filter(item => !!item) as Tables<'bands'>['id'][]
  const genreIds = timeGroup.items
    .filter(item => item.ressource_type === 'j_band_genres')
    .map(({ state_new, state_old }) =>
      state_new
        ? typeof state_new === 'object' && 'genre_id' in state_new
          ? Number(state_new.genre_id)
          : null
        : typeof state_old === 'object' && !!state_old && 'genre_id' in state_old
          ? Number(state_old.genre_id)
          : null
    )
    .filter(item => !!item) as Tables<'genres'>['id'][]

  if (timeGroup.items.find(item => item.ressource_type === 'j_concert_bands')) {
    return <ContributionItem contribution={timeGroup.items[0]} bandIds={bandIds} />
  }

  if (timeGroup.items.find(item => item.ressource_type === 'j_band_genres')) {
    return <ContributionItem contribution={timeGroup.items[0]} genreIds={genreIds} />
  }

  return timeGroup.items.map((item, index) => <ContributionItem key={index} contribution={item} />)
}
