import supabase from "../../utils/supabase"
import Navigation from '../../components/navigation'
import { useState } from "react"
import Modal from "../../components/Modal"
import AddBandForm from "../../components/AddBandForm"

export default function Home({ bands, countries }) {
	let [isOpen, setIsOpen] = useState(true)
	return (
		<>
			<div className="flex">

				<Navigation />

				<main className="p-8 max-w-2xl w-full">
					<div className="flex justify-between mb-6">
						<h1 className="h1">
							Bands
						</h1>
						<button onClick={() => setIsOpen(true)} className="btn btn-primary">
							Band hinzufügen
						</button>
					</div>
					<ul className="flex flex-wrap gap-2">
						{bands.map((band, index) => (
							<li key={index} className="btn btn-tag">
								{band.name} <span>({band.country})</span>
							</li>
						))}
					</ul>
				</main>
			</div>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<AddBandForm countries={countries} />
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


	if (error) {
		throw new Error(error)
	}

	return {
		props: {
			bands,
			countries,
		}
	}
}