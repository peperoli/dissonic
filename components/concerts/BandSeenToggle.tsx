import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { Band, BandSeen } from '../../types/types'
import { useConcertContext } from '../../hooks/useConcertContext'

interface BandSeenToggleProps {
  band: Band
  selectedBandsSeen: BandSeen[]
  setSelectedBandsSeen: Dispatch<SetStateAction<BandSeen[]>>
  user: User | null
}

export const BandSeenToggle = ({
  band,
  selectedBandsSeen,
  setSelectedBandsSeen,
  user,
}: BandSeenToggleProps) => {
  const { concert } = useConcertContext()
  const router = useRouter()
  const isSeen =
    selectedBandsSeen &&
    selectedBandsSeen.some(item => item.band_id === band.id && item.user_id === user?.id)
      ? true
      : false

  function handleChange() {
    if (user) {
      if (isSeen) {
        setSelectedBandsSeen(selectedBandsSeen.filter(item => item.band_id !== band.id))
      } else {
        setSelectedBandsSeen([
          ...selectedBandsSeen,
          {
            concert_id: concert.id,
            user_id: user.id,
            band_id: band.id,
          },
        ])
      }
    } else {
      router.push('/login')
    }
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
