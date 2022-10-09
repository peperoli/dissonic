import Head from 'next/head'
import supabase from "../utils/supabase"
import ConcertCard from '../components/ConcertCard'
import Modal from '../components/Modal'
import AddConcertForm from "../components/AddConcertForm"
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { PlusIcon } from '@heroicons/react/24/solid'
import PageWrapper from '../components/PageWrapper'
import { toast } from 'react-toastify'

export default function Home({ initialConcerts, bands, locations }) {
  const [isOpen, setIsOpen] = useState(false)
  const [concerts, setConcerts] = useState(initialConcerts)

  const notifyInsert = () => toast.success("Konzert erfolgreich hinzugefügt!")

	useEffect(() => {
		const subscriptionInsert = supabase.from('concerts').on('INSERT', payload => {
			setConcerts([
				...concerts,
				payload.new
			])
			setIsOpen(false)
			notifyInsert()
		}).subscribe()

		return () => supabase.removeSubscription(subscriptionInsert)
	}, [])
  return (
    <PageWrapper>
      <Head>
        <title>Concert Diary</title>
        <meta name="description" content="Keep track of your past concerts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="mb-0">
            Konzerte
          </h1>
          <Button
            handleClick={() => setIsOpen(true)}
            label="Konzert hinzufügen"
            style="primary"
            icon={<PlusIcon className="h-text" />} />
        </div>
        <div className="grid gap-4">
          {concerts.map(concert => (
            <ConcertCard
              key={concert.id}
              concert={concert}
              bands={bands}
              locations={locations}
            />
          ))}
        </div>
      </main>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <AddConcertForm
          bands={bands}
          cancelButton={<Button handleClick={() => setIsOpen(false)} label="Abbrechen" />}
        />
      </Modal>
    </PageWrapper>
  )
}

export async function getStaticProps() {
  const { data: concerts, error } = await supabase
    .from('concerts')
    .select('*')
    .order('date_start', { ascending: false, })
  const { data: bands } = await supabase
    .from('bands')
    .select('*')
    .order('name')
  const { data: locations } = await supabase.from('locations').select('id,name')

  if (error) {
    throw new Error(error)
  }

  return {
    props: {
      initialConcerts: concerts,
      bands,
      locations,
    }
  }
}
