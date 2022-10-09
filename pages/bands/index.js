import supabase from "../../utils/supabase"
import { useState } from "react"
import Modal from "../../components/Modal"
import AddBandForm from "../../components/AddBandForm"
import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import Button from "../../components/Button"
import { useEffect } from "react"
import { toast } from "react-toastify"
import PageWrapper from "../../components/PageWrapper"

export default function Home({ initialBands, countries, genres }) {
	const [isOpen, setIsOpen] = useState(false)
	const [bands, setBands] = useState(initialBands)

	function compare(a, b) {
		const bandA = a.name.toUpperCase()
		const bandB = b.name.toUpperCase()
	
		let comparison = 0
		if (bandA > bandB) {
			comparison = 1
		} else if (bandA < bandB) {
			comparison = -1
		}
		return comparison
	}

	const notifyInsert = () => toast.success("Band erfolgreich hinzugefügt!")

	useEffect(() => {
		const subscriptionInsert = supabase.from('bands').on('INSERT', payload => {
			setBands([
				...bands,
				payload.new
			])
			setIsOpen(false)
			notifyInsert()
		}).subscribe()

		return () => supabase.removeSubscription(subscriptionInsert)
	}, [])
	return (
		<PageWrapper>
				<main className="p-8 w-full">
					<div className="flex justify-between mb-6">
						<h1 className="mb-0">
							Bands
						</h1>
						<button onClick={() => setIsOpen(true)} className="btn btn-primary">
							<PlusIcon className="h-text" />
							Band hinzufügen
						</button>
					</div>
					<div className="grid gap-px p-4 rounded-xl bg-slate-700">
						{bands.sort(compare).map((band, index) => (
							<Link key={index} href={`/bands/${band.id}`}>
								<a className="grid grid-cols-3 px-3 py-2 rounded-md hover:bg-slate-500">
									<div>{band.name}</div>
									<div className="text-slate-300">{countries.find(country => country.iso2 === band.country).name}</div>
									<div className="text-sm text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
										{band.genres.join(' • ')}
									</div>
								</a>
							</Link>
						))}
					</div>
				</main>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<AddBandForm
					countries={countries}
					genres={genres}
					cancelButton={<Button handleClick={() => setIsOpen(false)} label="Abbrechen" />}
				/>
			</Modal>
		</PageWrapper>
	)
}

export async function getStaticProps() {
	const { data: bands, error } = await supabase
		.from('bands')
		.select('*')
		.order('name')
	const { data: countries, countriesError } = await supabase
		.from('countries')
		.select('name,iso2')
		.neq('local_name', null)
		.neq('iso2', 'AQ')
	const { data: genres } = await supabase
		.from('genres')
		.select('*')
		.order('name')

	if (error) {
		throw new Error(error)
	}

	return {
		props: {
			initialBands: bands,
			countries,
			genres,
		}
	}
}