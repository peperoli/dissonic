
export function getRelativeTimeFormatOptions(date: string | Temporal.Instant) {
  if (typeof date === 'string') {
    date = Temporal.Instant.from(date)
  }

  const currentDate = Temporal.Now.instant()
  const diff = date.since(currentDate).total({ unit: 'millisecond' })
  const diffSeconds = diff / 1000
  const diffMinutes = diffSeconds / 60
  const diffHours = diffMinutes / 60
  const diffDays = diffHours / 24
  let formatOptions: [number, Intl.RelativeTimeFormatUnit]

  if (Math.abs(diffDays) >= 365.25) {
    formatOptions = [Math.round(diffDays / 365.25), 'year']
  } else if (Math.abs(diffDays) >= 30.44) {
    formatOptions = [Math.round(diffDays / 30.44), 'month']
  } else if (Math.abs(diffDays) >= 1) {
    formatOptions = [Math.round(diffDays), 'day']
  } else if (Math.abs(diffHours) >= 1) {
    formatOptions = [Math.round(diffHours), 'hour']
  } else if (Math.abs(diffMinutes) >= 1) {
    formatOptions = [Math.round(diffMinutes), 'minute']
  } else {
    formatOptions = [Math.round(diff / 1000), 'second']
  }

  return formatOptions
}

export function getRelativeTime(
  date: string | Temporal.Instant,
  locale: Intl.LocalesArgument
) {
  const formatOptions = getRelativeTimeFormatOptions(date)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' })

  return rtf.format(...formatOptions)
}
