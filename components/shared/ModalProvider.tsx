'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import Modal from '../Modal'
const ConcertForm = dynamic(() => import('../concerts/Form').then(mod => mod.Form))
const DeleteConcertForm = dynamic(() =>
  import('../concerts/DeleteConcertForm').then(mod => mod.DeleteConcertForm)
)
const DeleteCommentForm = dynamic(() =>
  import('../concerts/DeleteCommentForm').then(mod => mod.DeleteCommentForm)
)
const BandForm = dynamic(() => import('../bands/Form').then(mod => mod.Form))
const DeleteBandForm = dynamic(() =>
  import('../bands/DeleteBandForm').then(mod => mod.DeleteBandForm)
)
const LocationForm = dynamic(() => import('../locations/Form').then(mod => mod.Form))
const ProfileForm = dynamic(() => import('../profile/Form').then(mod => mod.Form))
const PasswordForm = dynamic(() => import('../profile/PasswordForm').then(mod => mod.PasswordForm))
const AddFriendForm = dynamic(() =>
  import('../profile/AddFriendForm').then(mod => mod.AddFriendForm)
)
const RemoveFriendForm = dynamic(() =>
  import('../profile/DeleteFriendForm').then(mod => mod.RemoveFriendForm)
)

export const modalPaths = [
  'add-concert',
  'edit-concert',
  'delete-concert',
  'delete-comment',
  'add-band',
  'edit-band',
  'delete-band',
  'add-location',
  'edit-profile',
  'edit-password',
  'add-friend',
  'delete-friend',
] as const

const modalComponents = {
  'add-concert': ConcertForm,
  'edit-concert': ConcertForm,
  'delete-concert': DeleteConcertForm,
  'delete-comment': DeleteCommentForm,
  'add-band': BandForm,
  'edit-band': BandForm,
  'delete-band': DeleteBandForm,
  'add-location': LocationForm,
  'edit-profile': ProfileForm,
  'edit-password': PasswordForm,
  'add-friend': AddFriendForm,
  'delete-friend': RemoveFriendForm,
} as const

export const ModalProvider = () => {
  const [modal, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const pathname = usePathname()
  const close = () => setModal(null)
  const ModalComponent = modal ? modalComponents[modal] : null

  if (ModalComponent) {
    return (
      <Modal defaultOpen>
        <ModalComponent isNew={modal?.startsWith('add')} close={close} />
      </Modal>
    )
  }

  return null
}
