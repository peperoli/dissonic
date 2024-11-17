import { getTranslations } from 'next-intl/server'
import { SignupPage } from '../../components/signup/SignupPage'

export async function generateMetadata() {
  const t = await getTranslations('SignupPage')

  return {
    title:`${t('createAccount')} • Dissonic`,
  }
}

export default function Page() {
  return <SignupPage />
}
