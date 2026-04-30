import { Temporal } from '@js-temporal/polyfill'
import { useLocale, useTranslations } from 'next-intl'

export const ConcertDate = ({
  dateStart,
  dateEnd,
}: {
  dateStart: Temporal.PlainDate
  dateEnd?: Temporal.PlainDate | null
}) => {
  const t = useTranslations('ConcertDate')
  const locale = useLocale()
  const isCurrentYear = dateStart.year === Temporal.Now.plainDateISO().year

  return (
    <p className="truncate text-sm">
      {dateEnd
        ? t('dateStartToDateEnd', {
            dateStart: dateStart.toLocaleString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
            }),
            dateEnd: dateEnd.toLocaleString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
              year: isCurrentYear ? undefined : 'numeric',
            }),
          })
        : dateStart.toLocaleString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: isCurrentYear ? undefined : 'numeric',
          })}
    </p>
  )
}
