'use client'

import { EditIcon } from 'lucide-react'
import { Button } from '../Button'
import { useModal } from '../shared/ModalProvider'

export function EditProfileButton() {
  const [_, setModal] = useModal()
  return (
    <Button
      label="Profil bearbeiten"
      onClick={() => setModal('edit-profile')}
      icon={<EditIcon className="size-icon" />}
      contentType="icon"
      size="small"
      appearance="tertiary"
    />
  )
}
