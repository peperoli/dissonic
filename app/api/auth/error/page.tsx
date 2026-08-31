import { StatusBanner } from '@/components/forms/StatusBanner'
import { LogInIcon } from 'lucide-react'
import Link from 'next/link'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CallbackError(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  return (
    <div className="container">
      <blockquote className="text-slate-300">
        «The answer is just no» ~ <cite>Fleshgod Apocalypse</cite>
      </blockquote>
      <h1>Authentication error: {searchParams.error}</h1>
      {typeof searchParams.error_description === 'string' && (
        <StatusBanner statusType="error" message={searchParams.error_description} />
      )}
      <br />
      <Link href="/login" className="btn btn-tertiary">
        <LogInIcon className="size-icon" />
        Go to login
      </Link>
    </div>
  )
}
