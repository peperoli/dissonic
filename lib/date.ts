export function getMediumDate(date: string | number | Date, locale: Intl.LocalesArgument) {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }

  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getFullMonth(month: number, locale: string) {
  return new Date(`1970-${month + 1}-01`).toLocaleDateString(locale, { month: 'long' })
}
