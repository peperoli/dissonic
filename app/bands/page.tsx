import { getTranslations } from 'next-intl/server'
import { BandsPage } from '../../components/bands/BandsPage'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('BandsPage')

  return {
    title: `${t('bands')} • Dissonic`,
  }
}

export default async function Page() {
  return <BandsPage />
}
