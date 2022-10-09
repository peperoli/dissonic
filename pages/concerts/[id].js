import supabase from "../../utils/supabase"
import Link from "next/link"
import EditConcertForm from "../../components/EditConcertForm"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function ConcertPage({ concert, bands }) {
  return (
    <main className="max-w-2xl p-8">
      <Link href="/">
        <a className="btn btn-link">
          <ArrowLeftIcon className="h-text" />
          Go Back
          </a>
      </Link>
      <h1>Konzert<span className="ml-2 text-sm text-slate-500">{concert.id}</span></h1>
      <EditConcertForm concert={concert} bands={bands} />
    </main>
  )
}

export async function getServerSideProps({ params }) {

  const { data: concert, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: bands } = await supabase
  .from('bands')
  .select('*')
  .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return {
    props: {
      concert,
      bands,
    }
  }
}