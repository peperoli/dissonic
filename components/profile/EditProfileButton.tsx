'use client'

import { EditIcon } from 'lucide-react'
import { Button } from '../Button'
import { useModal } from '../shared/ModalProvider'
import { useTranslations } from 'next-intl'

export function EditProfileButton() {
  const [_, setModal] = useModal()
  const t = useTranslations('EditProfileButton')
  return (
    <Button
      label={t('editProfile')}
      onClick={() => setModal('edit-profile')}
      icon={<EditIcon className="size-icon" />}
      contentType="icon"
      size="small"
      appearance="tertiary"
    />
  )
}
