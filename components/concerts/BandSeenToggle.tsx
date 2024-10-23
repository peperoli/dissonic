import { User } from '@supabase/supabase-js'
import { Dispatch, SetStateAction } from 'react'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'
import { Tables, TablesInsert } from '@/types/supabase'

interface BandSeenToggleProps {
  band: Tables<'bands'>
  selectedBandsSeen: TablesInsert<'j_bands_seen'>[]
  setSelectedBandsSeen: Dispatch<SetStateAction<TablesInsert<'j_bands_seen'>[]>>
  user: User | null
}

export const BandSeenToggle = ({
  band,
  selectedBandsSeen,
  setSelectedBandsSeen,
  user,
}: BandSeenToggleProps) => {
  const { concert } = useConcertContext()
  const isSeen =
    selectedBandsSeen &&
    selectedBandsSeen.some(item => item.band_id === band.id && item.user_id === user?.id)
      ? true
      : false

  function handleChange() {
    if (!user) return
    if (isSeen) {
      setSelectedBandsSeen(selectedBandsSeen.filter(item => item.band_id !== band.id))
    } else {
      setSelectedBandsSeen([
        ...selectedBandsSeen,
        {
          concert_id: concert.id,
          user_id: user?.id,
          band_id: band.id,
        },
      ])
    }
  }

  if (!user) {
    return <p className="btn btn-tag pointer-events-none">{band.name}</p>
  }

  return (
    <label className={`btn btn-tag ${isSeen ? 'btn-seen' : ''}`}>
      <input
        type="checkbox"
        name="seenBands"
        value={`seenBand${band.id}`}
        checked={isSeen}
        onChange={handleChange}
        className="sr-only"
      />
      {band.name}
    </label>
  )
}
