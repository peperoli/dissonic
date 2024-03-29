export function getFullMonth(month: number) {
  return new Date(`1970-${month + 1}-01`).toLocaleDateString('de-CH', { month: 'long' })
}
