import { Temporal, Intl } from 'temporal-polyfill'

export function getMediumDate(
  date: string | Temporal.PlainDate | Temporal.Instant,
  locale: globalThis.Intl.LocalesArgument
) {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  if (typeof date === 'string') {
    date = Temporal.PlainDate.from(date)
  }

  return formatter.format(date)
}

export function getYearMonth(
  yearMonth: string | Temporal.PlainYearMonth,
  locale: globalThis.Intl.LocalesArgument
) {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  })

  if (typeof yearMonth === 'string') {
    yearMonth = Temporal.PlainYearMonth.from(yearMonth)
  }

  return formatter.format(yearMonth.toPlainDate({ day: 1 }))
}

export function getFullMonth(month: number, locale: globalThis.Intl.LocalesArgument) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  
  return formatter.format(Temporal.PlainDate.from({ year: 1970, month, day: 1 }))
}

export function isValidDate(date: string) {
  try {
    Temporal.PlainDate.from(date)
    return true
  } catch {
    return false
  }
}

export function getUnixTimestamp(date: string | Temporal.PlainDate) {
  if (typeof date === 'string') {
    date = Temporal.PlainDate.from(date)
  }

  return date.toZonedDateTime('UTC').epochMilliseconds / 1000
}
