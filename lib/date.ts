import { Temporal } from '@js-temporal/polyfill'

export function getMediumDate(date: string | Temporal.PlainDate, locale: Intl.LocalesArgument) {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (typeof date === 'string' || typeof date === 'number') {
    date = Temporal.PlainDate.from(date)
  }

  // @ts-expect-error
  return formatter.format(date)
}

export function getFullMonth(month: number, locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })

  // @ts-expect-error
  return formatter.format(Temporal.PlainYearMonth.from({ year: 1970, month }))
}
