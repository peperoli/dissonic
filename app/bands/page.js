import supabase from '../../utils/supabase'
import BandsPage from '../../components/bands/BandsPage'

async function fetchData() {
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
    console.error(error)
  }

  return { bands, countries, genres }
}

export default async function Page() {
  const { bands, countries, genres } = await fetchData()
  return <BandsPage initialBands={bands} countries={countries} genres={genres} />
}
