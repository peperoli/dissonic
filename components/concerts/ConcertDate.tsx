import { Intl, Temporal } from '@js-temporal/polyfill'
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
            dateStart: new Intl.DateTimeFormat(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
            }).format(dateStart),
            dateEnd: new Intl.DateTimeFormat(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
              year: isCurrentYear ? undefined : 'numeric',
            }).format(dateEnd),
          })
        : new Intl.DateTimeFormat(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: isCurrentYear ? undefined : 'numeric',
          }).format(dateStart)}
    </p>
  )
}
