import { Dispatch, SetStateAction } from 'react'
import { useEditProfile } from '../../hooks/profiles/useEditProfile'
import { useKillFile } from '../../hooks/files/useKillFile'
import { Profile } from '../../types/types'
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
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Profil bearbeiten</h2>
      {profile && (
        <Form
          profile={profile}
          editProfile={editProfile}
          killFile={killFile}
          close={() => setIsOpen(false)}
        />
      )}
    </Modal>
  )
}
