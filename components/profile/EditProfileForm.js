import supabase from '../../utils/supabase'
import { Button } from '../Button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'

function FileInput({ file, setFile}) {
  function handleChange(event) {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }
  return (
    <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-slate-500 bg-slate-700 accent-slate-50">
      <label htmlFor="avatar">
        <span className="absolute ml-4 mt-0.5 py-0.5 rounded text-xs text-slate-300 z-10">
          Profilbild
        </span>
        <span className="block p-4 pt-8">
          <ArrowUpTrayIcon className="h-icon mb-2" />
          {!file ? (
            <span className="text-sm text-slate-300">
              {/* Drag & Drop oder
              <br /> */}
              <span className="underline text-venom">Dateien durchsuchen</span>
            </span>
          ) : (
            <span>{file.name}</span>
          )}
        </span>
      </label>
      <input
        type="file"
        id="avatar"
        accept="image/png, image/jpeg, image/gif"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}

export default function EditProfileForm({ setIsOpen, avatarUrl, setAvatarUrl, username }) {
  const [file, setFile] = useState(null)
  const [value, setValue] = useState(username)
  const [usernames, setUsernames] = useState([])

  const router = useRouter()

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const { data: profiles, error } = await supabase.from('profiles').select('username')

      if (error) {
        throw error
      }

      setUsernames(profiles.map(item => item.username))
    } catch (error) {
      alert(error.message)
    }
  }

  async function updateProfile(event) {
    event.preventDefault()

    try {
      const avatarPath = `${username}/${file?.name}`
      if (file) {
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarPath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: downloadData, error: downloadError } = await supabase.storage
          .from('avatars')
          .download(avatarPath)

        if (downloadError) {
          throw downloadError
        }

        const url = URL.createObjectURL(downloadData)
        setAvatarUrl(url)
      }

      const { data: newProfile, error: updateProfileError } = await supabase
        .from('profiles')
        .update({ username: value, avatar_path: file ? avatarPath : null })
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
      <h2>Profil bearbeiten</h2>
      <form onSubmit={updateProfile} className="grid gap-4">
        <FileInput file={file} setFile={setFile} />
        <div className="form-control">
          <input
            type="text"
            id="username"
            name="username"
            value={value}
            onChange={event => setValue(event.target.value)}
            placeholder=""
          />
          <label htmlFor="username">Benutzername</label>
          {usernames && value !== username && usernames.includes(value) && (
            <div className="mt-1 text-sm text-red">
              Dieser Benutzername ist bereits vergeben, sei mal kreativ.
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <button
            type="submit"
            disabled={usernames && value !== username && usernames.includes(value)}
            className="btn btn-primary"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  )
}
