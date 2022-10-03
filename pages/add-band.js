import { useState } from "react"
import supabase from "../utils/supabase"
import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function AddBand({ countries, bands }) {
  let [newBands, setNewBands] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    await setNewBands([
      ...newBands,
      {
        name: event.target.name.value,
        country: event.target.country.value,
      }
    ])
    
    const { data: updatedBands, error } = await supabase
    .from('bands')
    .insert(newBands)
    
    if (error) {
      console.error(error)
    }
  }
  console.log(newBands);
  return (
    <main className="p-8">
      <Link href="/">
        <a className="btn btn-link">
          <ArrowLeftIcon className="h-text" />
          Go Back</a>
      </Link>
      <h1>Band hinzufügen</h1>
      <form onSubmit={handleSubmit} className="flex gap-6">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="country">Land</label>
          <select name="country" id="country">
            <option value={null}>Bitte wählen ...</option>
            <option value="international">International</option>
            {countries.map((country, index) => (
              <option key={index} value={country.iso2}>{country.local_name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary self-end">Band hinzufügen</button>
      </form>
      <ul className="flex flex-wrap gap-2 mt-6">
        {newBands?.map((band, index) => (
          <li key={index} className="btn btn-tag !bg-green-700">
            {band.name} <span>({band.country})</span>
          </li>
        ))}
        {bands.map((band, index) => (
          <li key={index} className="btn btn-tag">
            {band.name} <span>({band.country})</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export async function getStaticProps({ params }) {
  const { data: countries, countriesError } = await supabase
    .from('countries')
    .select('local_name,iso2')
    .neq('local_name', null)
    .neq('iso2', 'AQ')

  const { data: bands, bandsError } = await supabase
    .from('bands')
    .select('*')

  return {
    props: {
      countries,
      bands,
    }
  }
}