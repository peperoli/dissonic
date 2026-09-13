export function getCountryName(iso2: string, locale: string): string {
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })
  return regionNames.of(iso2) ?? iso2
}