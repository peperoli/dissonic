import clsx from 'clsx'
import { useLocale } from 'next-intl'

type ConcertDateProps = {
  date: Date
  isFirst?: boolean
  contrast?: boolean
}

export const ConcertDate = ({ date, isFirst, contrast }: ConcertDateProps) => {
  const locale = useLocale()
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()
  return (
    <div
      className={clsx(
        'relative flex aspect-square w-16 p-2 flex-none flex-col items-center justify-center rounded-lg transition duration-200',
        clsx(
          contrast
            ? isFirst
              ? 'bg-white/20 group-hover:bg-white/30 backdrop-blur-lg'
              : 'border border-white/20 backdrop-blur-lg'
            : isFirst
              ? 'bg-slate-700 group-hover:bg-slate-600'
              : 'border border-slate-700'
        )
      )}
    >
      {isCurrentYear ? (
        <>
          <span className="text-2xl font-bold leading-none">
            {date.toLocaleDateString(locale, { day: 'numeric' })}
          </span>
          <span className="text-sm">{date.toLocaleDateString(locale, { month: 'short' })}</span>
        </>
      ) : (
        <>
          <div className="flex gap-1">
            <span className="font-bold">
              {date.toLocaleDateString(locale, { day: 'numeric' })}
            </span>
            <span>{date.toLocaleDateString(locale, { month: 'short' })}</span>
          </div>
          <span className="text-sm">{date.getFullYear()}</span>
        </>
      )}
    </div>
  )
}
