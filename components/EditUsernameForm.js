import supabase from "../utils/supabase"
import Button from "./Button"
import { useState } from "react"
import { useRouter } from "next/router"

export default function EditUsernameForm({ setIsOpen, username, setUsername, usernames }) {
  const [value, setValue] = useState('')

  const router = useRouter()

  async function updateUsername(event) {
    event.preventDefault()

    try {
      const { data: newUsername, error: updateError } = await supabase
        .from('profiles')
        .update({ username: value })
        .eq('username', username)

      if (updateError) {
        throw updateError
      }

      router.push(`/`)
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div>
      <h2>Benutzername ändern</h2>
      <form onSubmit={updateUsername} className="grid gap-4">
        <div className="form-control">
          <input type="text" id="username" name="username" value={value} onChange={(event) => setValue(event.target.value)} placeholder="" />
          <label htmlFor="username">Benutzername</label>
          {usernames && usernames.includes(value) && (
            <div className="mt-1 text-sm text-red">Dieser Benutzername ist bereits vergeben, sei mal kreativ.</div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <button type="submit" disabled={usernames && usernames.includes(value)} className="btn btn-primary">Speichern</button>
        </div>
      </form>
    </div>
  )
}