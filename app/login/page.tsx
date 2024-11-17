import { Suspense } from 'react'
import LoginPage from '../../components/auth/LoginPage'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('LoginPage')

  return {
    title:`${t('loginToTrackConcerts')} • Dissonic`,
  }
}

export default async function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}
