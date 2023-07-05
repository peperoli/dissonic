import supabase from '../../utils/supabase'
import { Button } from '../Button'
import { useState, Dispatch, SetStateAction, SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '../Modal'
import { Profile } from '../../types/types'
import { FileInput } from '../FileInput'
import { useProfiles } from '../../hooks/useProfiles'

interface EditProfileFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  profile: Profile
  setProfile: Dispatch<SetStateAction<Profile>>
}

export const EditProfileForm = ({
  isOpen,
  setIsOpen,
  profile,
  setProfile,
}: EditProfileFormProps) => {
  const { data: profiles } = useProfiles()
  const usernames = profiles?.map(item => item.username)
  const [file, setFile] = useState<File | null>(null)
  const [username, setUsername] = useState(profile.username)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function updateProfile(event: SyntheticEvent) {
    event.preventDefault()

    try {
      setLoading(true)
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
      }

      const { data: newProfile, error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          username: username,
          avatar_path: file ? avatarPath : profile.avatar_path ? profile.avatar_path : null,
        })
        .eq('username', username)
        .select()
        .single()

      if (updateProfileError) {
        throw updateProfileError
      }

      setProfile(prevState => ({
        ...prevState,
        username: username,
        avatar_path: file ? avatarPath : profile.avatar_path ? profile.avatar_path : null,
      }))
      router.push(`/users/${newProfile.username}`)
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Oops')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Profil bearbeiten</h2>
      <form onSubmit={updateProfile} className="grid gap-4">
        <FileInput file={file} setFile={setFile} />
        <div className="form-control">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            placeholder=""
          />
          <label htmlFor="username">Benutzername</label>
          {username !== profile.username && usernames?.includes(username) && (
            <div className="mt-1 text-sm text-red">
              Dieser Benutzername ist bereits vergeben, sei mal kreativ.
            </div>
          )}
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button
            type="submit"
            label="Speichern"
            style="primary"
            disabled={usernames && username !== username && usernames.includes(username)}
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  )
}
