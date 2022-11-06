import supabase from "../utils/supabase"

export default function Update() {
  async function updateUser(event) {
    event.preventDefault()
    try {
      const { error: updateError } = await supabase.auth.update({ password: event.target.password.value })

      if (updateError) {
        throw updateError
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <main className="p-8">
      <h1>Benutzerdaten anpassen</h1>
      <form onSubmit={updateUser} className="grid gap-4">
        <div className="form-control">
          <input type="password" id="password" name="password" placeholder="" />
          <label htmlFor="password">Passwort</label>
        </div>
        <button type="submit" className="btn btn-primary">Speichern</button>
      </form>
    </main>
  )
}