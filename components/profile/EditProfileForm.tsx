import { Dispatch, SetStateAction } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useEditProfile } from '../../hooks/useEditProfile'
import { useKillFile } from '../../hooks/useKillFile'
import { EditProfile, Profile } from '../../types/types'
import Modal from '../Modal'
import { Form } from './Form'

interface EditProfileFormProps {
  profile: Profile
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditProfileForm = ({ profile, isOpen, setIsOpen }: EditProfileFormProps) => {
  const editProfile = useEditProfile()
  const killFile = useKillFile()

  const onSubmit: SubmitHandler<EditProfile> = async formData => {
    if (profile.avatar_path) {
      killFile.mutate({ bucket: 'avatars', name: profile.avatar_path })
    }
    editProfile.mutate({ ...formData, id: profile.id })
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Profil bearbeiten</h2>
      {profile && (
        <Form
          profile={profile}
          onSubmit={onSubmit}
          editProfile={editProfile}
          killFile={killFile}
          close={() => setIsOpen(false)}
        />
      )}
    </Modal>
  )
}
