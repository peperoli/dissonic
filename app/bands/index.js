import supabase from "../../utils/supabase"
import { useState } from "react"
import Modal from "../../components/Modal"
import AddBandForm from "../../components/bands/AddBandForm"
import { ArrowUturnLeftIcon, PlusIcon } from "@heroicons/react/20/solid"
import PageWrapper from "../../components/layout/PageWrapper"
import Table from "../../components/Table"
import TableRow from "../../components/TableRow"
import Search from "../../components/Search"
import FilterButton from "../../components/FilterButton"
import Button from "../../components/Button"
import useMediaQuery from "../../hooks/useMediaQuery"

export default function PageBands({ initialBands, countries, genres }) {
	const [isOpen, setIsOpen] = useState(false)
	const [bands, setBands] = useState(initialBands)
	const [selectedGenres, setSelectedGenres] = useState([])
	const [selectedCountries, setSelectedCountries] = useState([])
	const [query, setQuery] = useState('')

	const regExp = new RegExp(query, 'i')
	const filteredBands = bands.filter(item => item.name.match(regExp))
	const filteredLength = filteredBands.filter(filterRule).length !== bands.length ? filteredBands.filter(filterRule).length : null

	function filterRule(item) {
		let [genreFilter, countryFilter] = [true, true]
		const selectedGenreIds = selectedGenres.map(item => item.id)
		const selectedCountryIds = selectedCountries.map(item => item.id)
		if (selectedGenreIds.length > 0) {
			genreFilter = item.genres.some(genreId => selectedGenreIds.includes(genreId.id))
		}
		if (selectedCountryIds.length > 0) {
			countryFilter = selectedCountryIds.includes(item.country?.id)
		}
		return genreFilter && countryFilter
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

	function resetAll() {
		setQuery('')
		setSelectedCountries([])
		setSelectedGenres([])
	}

	const isDesktop = useMediaQuery('(min-width: 768px)')
	return (
		<PageWrapper>
			<main className="p-4 md:p-8 w-full">
				{!isDesktop && (
					<div className="fixed bottom-0 right-0 m-4">
						<Button
							onClick={() => setIsOpen(true)}
							label="Band hinzufügen"
							style="primary"
							contentType="icon"
							icon={<PlusIcon className="h-icon" />}
						/>
					</div>
				)}
				<div className="sr-only md:not-sr-only flex justify-between md:mb-6">
					<h1 className="mb-0">
						Bands
					</h1>
					{isDesktop && (
						<Button
							onClick={() => setIsOpen(true)}
							label="Band hinzufügen"
							style="primary"
							icon={<PlusIcon className="h-icon" />}
						/>
					)}
				</div>
				<Table>
					<div className="grid md:grid-cols-3 gap-4">
						<Search name="searchBands" placeholder="Bands" query={query} setQuery={setQuery} />
						<FilterButton
							name="countries"
							options={countries}
							selectedOptions={selectedCountries}
							setSelectedOptions={setSelectedCountries}
						/>
						<FilterButton
							name="genres"
							options={genres}
							selectedOptions={selectedGenres}
							setSelectedOptions={setSelectedGenres}
						/>
					</div>
					<div className="flex gap-4 items-center">
						<div className="my-4 text-sm text-slate-300">
							{typeof filteredLength === 'number' && <span>{filteredLength}&nbsp;von&nbsp;</span>}{bands.length}&nbsp;Einträge
						</div>
						{typeof filteredLength === 'number' && (
							<button onClick={resetAll} className="flex gap-2 px-2 py-1 rounded-md text-sm hover:bg-slate-700">
								<ArrowUturnLeftIcon className="h-icon text-slate-300" />
								Zurücksetzen
							</button>
						)}
					</div>
					{typeof filteredLength === 'number' && filteredLength === 0 ? (
						<div>Blyat! Keine Einträge gefunden.</div>
					) : (
						filteredBands.filter(filterRule).sort(compare).map(band => (
							<TableRow key={band.id} href={`/bands/${band.id}`}>
								<div className="font-bold">{band.name}</div>
								<div className="text-slate-300">{band.country?.name}</div>
								<div className="text-slate-300 whitespace-nowrap text-ellipsis overflow-hidden">
									{band.genres?.map(item => item.name).join(' • ')}<br />
								</div>
							</TableRow>
						))
					)}
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

export async function getServerSideProps() {
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