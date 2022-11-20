import supabase from "../../utils/supabase"
import Button from "../Button"

export default function EditPasswordForm({ setIsOpen }) {
  async function updatePass(event) {
    event.preventDefault()

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: event.target.password.value })

      if (updateError) {
        throw updateError
      }

      setIsOpen(false)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div>
      <h2>Passwort ändern</h2>
      <form onSubmit={updatePass} className="grid gap-4">
        <div className="form-control">
          <input type="password" id="password" name="password" placeholder="" />
          <label htmlFor="password">Passwort</label>
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <button type="submit" className="btn btn-primary">Speichern</button>
        </div>
      </form>
    </div>
  )
}