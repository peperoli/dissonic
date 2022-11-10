import supabase from "../../utils/supabase"
import Button from "../Button"

export default function AddBandForm({ locations, setIsOpen, setLocations }) {
  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { data: newLocation, error: newLocationError } = await supabase
        .from('locations')
        .insert({
          name: event.target.name.value,
          city: event.target.city.value,
        })
        .single()
        .select()
  
      if (newLocationError) {
        throw newLocationError
      }

      setLocations([
        ...locations,
        newLocation
      ])
      setIsOpen(false)
    } catch (error) {
      alert(error.message)
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
        <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
        <button type="submit" className="btn btn-primary">Location hinzufügen</button>
      </div>
    </form>
  )
}