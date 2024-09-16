export function getRelativeTime(date: string | number | Date, locale: Intl.LocalesArgument) {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }

  const currentDate = new Date()
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diff = date.getTime() - currentDate.getTime()
  const diffDays = diff * (1 / (1000 * 60 * 60 * 24))

  if (Math.abs(diffDays) >= 365.25) {
    return rtf.format(Math.round(diffDays / 365.25), 'year')
  } else if (Math.abs(diffDays) >= 30.44) {
    return rtf.format(Math.round(diffDays / 30.44), 'month')
  } else if (Math.abs(diffDays) >= 1) {
    return rtf.format(Math.round(diffDays), 'day')
  } else {
    const diffHours = diff * (1 / (1000 * 60 * 60))

    if (Math.abs(diffHours) >= 1) {
      return rtf.format(Math.round(diffHours), 'hour')
    } else {
      const diffMinutes = diff * (1 / (1000 * 60))

      if (Math.abs(diffMinutes) >= 1) {
        return rtf.format(Math.round(diffMinutes), 'minute')
      } else {
        return rtf.format(Math.round(diff / 1000), 'second')
      }
    }
  }
}
