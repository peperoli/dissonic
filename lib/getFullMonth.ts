export function getFullMonth(month: number, locale: string) {
  return new Date(`1970-${month + 1}-01`).toLocaleDateString(locale, { month: 'long' })
}
