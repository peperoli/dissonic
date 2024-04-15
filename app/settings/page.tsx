import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { EmailForm } from '@/components/profile/EmailForm'

async function fetchData() {
  const supabase = createClient(cookies())

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error

  if (!user) redirect('/login?redirect=/settings')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user?.id)
    .single()

  if (profileError) throw profileError

  return { profile }
}

export default async function Page() {
  const { profile } = await fetchData()

  return (
    <PageWrapper>
      <main className="container-sm">
        <Link href={`/users/${profile.username}`} className="btn btn-small btn-tertiary mb-2">
          <ArrowLeft className="size-icon" />
          Zurück zum Profil
        </Link>
        <h1>Konto-Einstellungen</h1>
        <div className="rounded-lg bg-slate-800 p-6 mb-4">
          <PasswordForm />
        </div>
        <div className="rounded-lg bg-slate-800 p-6">
          <EmailForm />
        </div>
      </main>
    </PageWrapper>
  )
}
