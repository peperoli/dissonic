import { Temporal } from '@js-temporal/polyfill'

export function getMediumDate(date: string | Temporal.PlainDate | Temporal.Instant, locale: Temporal.LocalesArgument) {
  if (typeof date === 'string') {
    date = Temporal.PlainDate.from(date)
  }

  return date.toLocaleString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getFullMonth(month: number, locale: Temporal.LocalesArgument) {
  return Temporal.PlainDate.from({ year: 1970, month, day: 1 }).toLocaleString(locale, {
    month: 'long',
  })
}

export function isValidDate(date: string) {
  try {
    Temporal.PlainDate.from(date)
    return true
  } catch {
    return false
  }
}
