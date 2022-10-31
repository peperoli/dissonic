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
import MultiSelect from '../components/MultiSelect'

export default function Home({ initialConcerts, bands, locations, allBandsSeen }) {
  const [isOpen, setIsOpen] = useState(false)
  const [concerts, setConcerts] = useState(initialConcerts)
  const [selectedBands, setSelectedBands] = useState([])
  const [bandsSeen, setBandsSeen] = useState([])

  const notifyInsert = () => toast.success("Konzert erfolgreich hinzugefügt!")

  useEffect(() => {
    const user = supabase.auth.user()
    setBandsSeen(allBandsSeen.filter(bandsSeen => bandsSeen.user_id === user?.id))
  }, [allBandsSeen])

  function filterRule(item) {
    let rule = true
    const selectedBandIds = selectedBands.map(item => item.id)
    if (selectedBandIds.length > 0) {
      rule = item.bands.some(band => selectedBandIds.includes(band.id))
    }
    return rule
  }

  function compare(a, b) {
		let comparison = 0
		if (a.date_start > b.date_start) {
			comparison = -1
		} else if (a.date_start < b.date_start) {
			comparison = 1
		}
		return comparison
	}
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
            onClick={() => setIsOpen(true)}
            label="Konzert hinzufügen"
            style="primary"
            icon={<PlusIcon className="h-text" />} />
        </div>
        <div className="grid gap-4">
          <MultiSelect name="bands" options={bands} selectedOptions={selectedBands} setSelectedOptions={setSelectedBands} />
          <div className="text-sm text-slate-300">
            {concerts.length !== concerts.filter(filterRule).length && <>{concerts.filter(filterRule).length}&nbsp;von&nbsp;</>}
            {concerts.length}
            &nbsp;Einträge
          </div>
          {concerts.filter(filterRule).sort(compare).map(concert => (
            <ConcertCard
              key={concert.id}
              concert={concert}
              bandsSeen={bandsSeen.find(row => row.concert_id === concert.id)}
            />
          ))}
        </div>
      </main>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <AddConcertForm
          bands={bands}
          locations={locations}
          setIsOpen={setIsOpen}
          concerts={concerts}
          setConcerts={setConcerts}
        />
      </Modal>
    </PageWrapper>
  )
}

export async function getStaticProps() {
  const { data: concerts, error } = await supabase
    .from('concerts')
    .select('*, location(*), bands(*)')
    .order('date_start', { ascending: false, })
  const { data: bands } = await supabase
    .from('bands')
    .select('*')
    .order('name')
  const { data: bandsSeen } = await supabase
    .from('bands_seen')
    .select('*')
  const { data: locations } = await supabase.from('locations').select('id,name')

  if (error) {
    throw new Error(error)
  }

  return {
    props: {
      initialConcerts: concerts,
      allBandsSeen: bandsSeen,
      bands,
      locations,
    }
  }
}
