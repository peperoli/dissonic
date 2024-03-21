'use client'

import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import Modal from '../Modal'

function Loader() {
  return <Loader2 className="size-8 animate-spin text-slate-300" />
}

const ConcertForm = dynamic(() => import('../concerts/Form').then(mod => mod.Form), {
  loading: () => <Loader />,
})
const DeleteConcertForm = dynamic(
  () => import('../concerts/DeleteConcertForm').then(mod => mod.DeleteConcertForm),
  { loading: () => <Loader /> }
)
const DeleteCommentForm = dynamic(
  () => import('../concerts/DeleteCommentForm').then(mod => mod.DeleteCommentForm),
  { loading: () => <Loader /> }
)
const BandForm = dynamic(() => import('../bands/Form').then(mod => mod.Form), {
  loading: () => <Loader />,
})
const DeleteBandForm = dynamic(
  () => import('../bands/DeleteBandForm').then(mod => mod.DeleteBandForm),
  { loading: () => <Loader /> }
)
const LocationForm = dynamic(() => import('../locations/Form').then(mod => mod.Form), {
  loading: () => <Loader />,
})
const DeleteLocationForm = dynamic(
  () => import('../locations/DeleteLocationForm').then(mod => mod.DeleteLocationForm),
  { loading: () => <Loader /> }
)
const ProfileForm = dynamic(() => import('../profile/Form').then(mod => mod.Form), {
  loading: () => <Loader />,
})
const PasswordForm = dynamic(
  () => import('../profile/PasswordForm').then(mod => mod.PasswordForm),
  { loading: () => <Loader /> }
)
const AddFriendForm = dynamic(
  () => import('../profile/AddFriendForm').then(mod => mod.AddFriendForm),
  { loading: () => <Loader /> }
)
const RemoveFriendForm = dynamic(
  () => import('../profile/DeleteFriendForm').then(mod => mod.RemoveFriendForm),
  { loading: () => <Loader /> }
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
  'edit-location',
  'delete-location',
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
  'edit-location': LocationForm,
  'delete-location': DeleteLocationForm,
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
