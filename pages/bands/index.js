import supabase from "../../utils/supabase"
import { useState } from "react"
import Modal from "../../components/Modal"
import AddBandForm from "../../components/AddBandForm"
import { PlusIcon } from "@heroicons/react/24/solid"
import PageWrapper from "../../components/PageWrapper"
import Table from "../../components/Table"
import TableRow from "../../components/TableRow"
import Search from "../../components/Search"
import MultiSelect from "../../components/MultiSelect"

export default function PageBands({ initialBands, countries, genres }) {
	const [isOpen, setIsOpen] = useState(false)
	const [bands, setBands] = useState(initialBands)
	const [selectedGenres, setSelectedGenres] = useState([])

	function filterRule(item) {
		let rule = true
		const selectedGenreIds = selectedGenres.map(item => item.id)
		if (selectedGenreIds.length > 0) {
			rule = item.genres.some(genreId => selectedGenreIds.includes(genreId.id))
		}
		return rule
	}

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

	const [query, setQuery] = useState('')

	const regExp = new RegExp(query, 'i')
	const filteredBands = bands.filter(item => item.name.match(regExp))
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
				<Table>
					<div className="flex items-end gap-4">
						<Search name="searchBands" query={query} setQuery={setQuery} />
						<MultiSelect
							name="genres"
							options={genres}
							selectedOptions={selectedGenres}
							setSelectedOptions={setSelectedGenres}
						/>
					</div>
					{filteredBands.filter(filterRule).sort(compare).map(band => (
						<TableRow key={band.id} href={`/bands/${band.id}`}>
							<div>{band.name}</div>
							<div className="text-slate-300">{band.country?.name}</div>
							<div className="text-sm text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
								{band.genres?.map(item => item.name).join(' • ')}<br />
							</div>
						</TableRow>
					))}
				</Table>
			</main>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<AddBandForm
					countries={countries}
					genres={genres}
					bands={bands}
					setBands={setBands}
					setIsOpen={setIsOpen}
				/>
			</Modal>
		</PageWrapper>
	)
}

export async function getStaticProps() {
	const { data: bands, error } = await supabase
		.from('bands')
		.select('*, country(*), genres(*)')
		.order('name')

	const { data: countries } = await supabase
		.from('countries')
		.select('id, name')
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