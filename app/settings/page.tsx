import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PasswordForm } from '@/components/settings/PasswordForm'
import { EmailForm } from '@/components/settings/EmailForm'
import { getTranslations } from 'next-intl/server'
import { OAuthSettings } from '@/components/settings/OAuthSettings'

export async function generateMetadata() {
  const t = await getTranslations('SettingsPage')

  return {
    title: `${t('accountSettings')} • Dissonic`,
  }
}

async function fetchData() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/login?redirect=/settings')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user?.id)
    .single()

  if (profileError) throw profileError

  return { user, profile }
}

export default async function SettingsPage() {
  const { user, profile } = await fetchData()
  const t = await getTranslations('SettingsPage')

  return (
    <main className="container">
      <Link href={`/users/${profile.username}`} className="btn btn-small btn-tertiary mb-2">
        <ArrowLeft className="size-icon" />
        {t('profile')}
      </Link>
      <h1>{t('accountSettings')}</h1>
      {user.identities?.some(identity => identity.provider === 'email') && (
        <div className="mb-4 rounded-lg bg-slate-800 p-6">
          <PasswordForm />
        </div>
      )}
      <div className="mb-4 rounded-lg bg-slate-800 p-6">
        <EmailForm />
      </div>
      {user.identities && <OAuthSettings userIdentities={user.identities} />}
    </main>
  )
}
