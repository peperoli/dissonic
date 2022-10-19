import supabase from "../utils/supabase"

export default function AddBandForm({ locations, cancelButton }) {
  async function handleSubmit(event) {
    event.preventDefault()
    
    const { data: updateLocations, error } = await supabase
    .from('locations')
    .insert({
      name: event.target.name.value,
      city: event.target.city.value,
    })
    
    if (error) {
      console.error(error)
    }
  }
	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div className="form-control">
				<input type="text" name="name" id="name" placeholder="Hallenstadion" />
				<label htmlFor="name">Name</label>
			</div>
			<div className="form-control">
				<input type="text" name="city" id="city" placeholder="Zürich" />
				<label htmlFor="city">Ort</label>
			</div>
      <div className="flex justify-end gap-3">
        {cancelButton}
        <button type="submit" className="btn btn-primary">Location hinzufügen</button>
      </div>
		</form>
	)
}