import { useState } from "react"
import supabase from "../utils/supabase"

export default function AddBandForm({ countries }) {
	let [newBands, setNewBands] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()

    setNewBands([
      ...newBands,
      {
        name: event.target.name.value,
        country: event.target.country.value,
      }
    ])
    
    const { data: updatedBands, error } = await supabase
    .from('bands')
    .insert({
      name: event.target.name.value,
      country: event.target.country.value,
    })
    
    if (error) {
      console.error(error)
    }
  }
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
			<button type="submit" className="btn btn-primary">Band hinzufügen</button>
		</form>
	)
}