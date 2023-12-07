import { Band, Concert } from '../../types/types'

type ScoreProps = {
  bandsSeen: Band[]
  uniqueBandsSeen: Band[]
  concertsSeen: Concert[]
  festivalsSeen: Concert[]
}

export function Score({ bandsSeen, uniqueBandsSeen, concertsSeen, festivalsSeen }: ScoreProps) {
  return (
    <>
      <div className="p-6 rounded-lg bg-slate-800">
        <div className="flex gap-4 mb-2">
          <div className="text-venom">
            <div className="text-2xl">{uniqueBandsSeen?.length}</div>
            {bandsSeen.length > uniqueBandsSeen.length && (
              <div className="text-xs">verschiedene</div>
            )}
          </div>
          {bandsSeen.length > uniqueBandsSeen.length && (
            <div className="text-slate-500">
              <div className="text-2xl"> {bandsSeen?.length}</div>
              <div className="text-xs">total</div>
            </div>
          )}
        </div>
        <h2 className="text-sm font-normal mb-0">Bands live erlebt</h2>
      </div>
      <div className="p-6 rounded-lg bg-slate-800">
        <div className="flex gap-4 mb-2">
          <div className="text-venom">
            <div className="text-2xl"> {concertsSeen?.length}</div>
            {festivalsSeen.length > 0 && <div className="text-xs">total</div>}
          </div>
          {festivalsSeen.length > 0 && (
            <>
              <div className="text-slate-300">
                <div className="text-2xl">
                  {concertsSeen.filter(item => !item.is_festival)?.length}
                </div>
                <div className="text-xs">Konzerte</div>
              </div>
              <div className="text-slate-500">
                <div className="text-2xl"> {festivalsSeen?.length}</div>
                <div className="text-xs">Festivals</div>
              </div>
            </>
          )}
        </div>
        <h2 className="text-sm font-normal mb-0">Konzerte besucht</h2>
      </div>
    </>
  )
}
