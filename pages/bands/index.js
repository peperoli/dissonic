import supabase from "../../utils/supabase"
import Navigation from '../../components/navigation'
import { useState } from "react"
import Modal from "../../components/Modal"
import AddBandForm from "../../components/AddBandForm"
import { PlusIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import Button from "../../components/Button"

export default function Home({ bands, countries, genres }) {
	let [isOpen, setIsOpen] = useState(false)
	return (
		<>
			<div className="flex">
				<Navigation />
				<main className="p-8 max-w-2xl w-full">
					<div className="flex justify-between mb-6">
						<h1 className="mb-0">
							Bands
						</h1>
						<button onClick={() => setIsOpen(true)} className="btn btn-primary">
							<PlusIcon className="h-text" />
							Band hinzufügen
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{bands.map((band, index) => (
							<Link key={index} href={`/bands/${band.id}`}>
								<a className="btn btn-tag">
									{band.name} <span>({band.country})</span>
								</a>
							</Link>
						))}
					</div>
				</main>
			</div>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<AddBandForm
					countries={countries}
					genres={genres}
					cancelButton={<Button handleClick={() => setIsOpen(false)} label="Abbrechen" />}
				/>
			</Modal>
		</>
	)
}

export async function getStaticProps() {
	const { data: bands, error } = await supabase.from('bands').select('*')
	const { data: countries, countriesError } = await supabase
		.from('countries')
		.select('local_name,iso2')
		.neq('local_name', null)
		.neq('iso2', 'AQ')
	const { data: genres } = await supabase.from('genres').select('*')

	if (error) {
		throw new Error(error)
	}

	return {
		props: {
			bands,
			countries,
			genres,
		}
	}
}