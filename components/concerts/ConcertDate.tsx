import { useLocale, useTranslations } from 'next-intl'

export const ConcertDate = ({ dateStart, dateEnd }: { dateStart: Date; dateEnd?: Date | null }) => {
  const t = useTranslations('ConcertDate')
  const locale = useLocale()
  const isCurrentYear = dateStart.getFullYear() === new Date().getFullYear()

  return (
    <p className="truncate text-sm">
      {dateEnd
        ? t('dateStartToDateEnd', {
            dateStart: dateStart.toLocaleDateString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
            }),
            dateEnd: dateEnd.toLocaleDateString(locale, {
              weekday: 'short',
              day: 'numeric',
              month: 'numeric',
              year: isCurrentYear ? undefined : 'numeric',
            }),
          })
        : dateStart.toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: isCurrentYear ? undefined : 'numeric',
          })}
    </p>
  )
}
