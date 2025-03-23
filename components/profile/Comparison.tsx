'use client'

import { useSession } from '@/hooks/auth/useSession'
import { useBandsSeen } from '@/hooks/bands/useBandsSeen'
import { useCompareBandsSeen } from '@/hooks/profiles/useCompareBandsSeen'
import { useCompareConcertsSeen } from '@/hooks/profiles/useCompareConcertsSeen'
import { Tooltip } from '../shared/Tooltip'
import { useParams } from 'next/navigation'

export function Comparison({ profileId }: { profileId: string }) {
  const { data: session } = useSession()
  const { data: bandsSeen1 } = useBandsSeen({ userId: session?.user.id })
  const { data: bandsSeen2 } = useBandsSeen({ userId: profileId })
  const { data: concerts } = useCompareConcertsSeen(session?.user.id, profileId)
  const { data: bands } = useCompareBandsSeen(session?.user.id, profileId)
  const params = useParams()
  const shared = concerts?.count
  const onlyUser1 = Array.from(new Set(bandsSeen1?.map(band => band.concert_id))).length - shared
  const onlyUser2 = Array.from(new Set(bandsSeen2?.map(band => band.concert_id))).length - shared
  const total = onlyUser1 + onlyUser2 + shared
  const sharedBands = bands?.count
  const onlyUser1Bands = Array.from(new Set(bandsSeen1?.map(band => band.band_id))).length - sharedBands
  const onlyUser2Bands = Array.from(new Set(bandsSeen2?.map(band => band.band_id))).length - sharedBands
  const totalBands = onlyUser1 + onlyUser2 + sharedBands

  return (
    <section className="rounded-lg bg-slate-800 p-6 grid gap-4">
      <h2>Profil-Vergleich</h2>
      <div className="flex gap-1">
        <Tooltip triggerOnClick content={`Nur du: ${onlyUser1}`}>
          <div className="h-4 rounded bg-venom" style={{ width: `${(onlyUser1 / total) * 100}%` }} />
        </Tooltip>
        <Tooltip triggerOnClick content={`Gemeinsam: ${shared}`}>
          <div className="h-4 rounded bg-purple" style={{ width: `${(shared / total) * 100}%` }} />
        </Tooltip>
        <Tooltip triggerOnClick content={`Nur ${params.username}: ${onlyUser2}`}>
          <div className="h-4 rounded bg-blue" style={{ width: `${(onlyUser2 / total) * 100}%` }} />
        </Tooltip>
      </div>
      <div className="flex gap-1">
        <Tooltip triggerOnClick content={`Nur du: ${onlyUser1Bands}`}>
          <div className="h-4 rounded bg-venom" style={{ width: `${(onlyUser1Bands / totalBands) * 100}%` }} />
        </Tooltip>
        <Tooltip triggerOnClick content={`Gemeinsam: ${sharedBands}`}>
          <div className="h-4 rounded bg-purple" style={{ width: `${(sharedBands / totalBands) * 100}%` }} />
        </Tooltip>
        <Tooltip triggerOnClick content={`Nur ${params.username}: ${onlyUser2Bands}`}>
          <div className="h-4 rounded bg-blue" style={{ width: `${(onlyUser2Bands / totalBands) * 100}%` }} />
        </Tooltip>
      </div>
    </section>
  )
}
