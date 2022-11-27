import supabase from "../../utils/supabase"
import Button from "../Button"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function EditProfileForm({ setIsOpen, username }) {
  const [value, setValue] = useState(username)
  const [usernames, setUsernames] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const { data: profiles, error} = await supabase
        .from('profiles')
        .select('username')

      if (error) {
        throw error
      }

      setUsernames(profiles.map(item => item.username))
    } catch (error) {
      alert(error.message)
    }
  }

  async function updateUsername(event) {
    event.preventDefault()

    try {
      let file

      if (event.target.avatar.files) {
        file = event.target.avatar.files[0]
      }
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .upload('public/' + file?.name, {
          cacheControl: '3600',
          upsert: false
        })

      const { data: newProfile, error: updateProfileError } = await supabase
        .from('profiles')
        .update({ username: value })
        .eq('username', username)
        .single()
        .select()

      if (updateProfileError) {
        throw updateProfileError
      }

      if (newProfile) {
        router.push(`/users/${newProfile.username}`)
        setIsOpen(false)
      }
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div>
      <h2>Benutzername ändern</h2>
      <form onSubmit={updateUsername} className="grid gap-4">
        <div className="form-control">
          <label htmlFor="avatar">Profilbild</label>
          <input type="file" id="avatar" accept="image/png, image/jpeg, image/gif" />
        </div>
        <div className="form-control">
          <input type="text" id="username" name="username" value={value} onChange={(event) => setValue(event.target.value)} placeholder="" />
          <label htmlFor="username">Benutzername</label>
          {usernames && value !== username && usernames.includes(value) && (
            <div className="mt-1 text-sm text-red">Dieser Benutzername ist bereits vergeben, sei mal kreativ.</div>
          )}
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <button type="submit" disabled={usernames && value !== username && usernames.includes(value)} className="btn btn-primary">Speichern</button>
        </div>
      </form>
    </div>
  )
}