import { getTranslations } from 'next-intl/server'
import { LocationsPage } from '../../components/locations/LocationsPage'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('LocationsPage')

  return {
    title: `${t('locations')} • Dissonic`,
  }
}

export default async function Page() {
  return <LocationsPage />
}
