import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { EmailForm } from '@/components/profile/EmailForm'

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

  return { profile }
}

export default async function Page() {
  const { profile } = await fetchData()

  return (
    <main className="container-sm">
      <Link href={`/users/${profile.username}`} className="btn btn-small btn-tertiary mb-2">
        <ArrowLeft className="size-icon" />
        Zurück zum Profil
      </Link>
      <h1>Konto-Einstellungen</h1>
      <div className="mb-4 rounded-lg bg-slate-800 p-6">
        <PasswordForm />
      </div>
      <div className="rounded-lg bg-slate-800 p-6">
        <EmailForm />
      </div>
    </main>
  )
}
