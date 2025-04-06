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
