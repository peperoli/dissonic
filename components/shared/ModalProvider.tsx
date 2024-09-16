'use client'

import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import Modal from '../Modal'
import { ReactElement } from 'react'
import { DialogTitle } from '@radix-ui/react-dialog'

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
  'add-friend',
  'delete-friend',
] as const

const modals = {
  'add-concert': { title: 'Konzert hinzufügen', component: ConcertForm },
  'edit-concert': { title: 'Konzert bearbeiten', component: ConcertForm },
  'delete-concert': { title: 'Konzert löschen', component: DeleteConcertForm },
  'delete-comment': { title: 'Kommentar löschen', component: DeleteCommentForm },
  'add-band': { title: 'Band hinzufügen', component: BandForm },
  'edit-band': { title: 'Band bearbeiten', component: BandForm },
  'delete-band': { title: 'Band löschen', component: DeleteBandForm },
  'add-location': { title: 'Location hinzufügen', component: LocationForm },
  'edit-location': { title: 'Location bearbeiten', component: LocationForm },
  'delete-location': { title: 'Location löschen', component: DeleteLocationForm },
  'edit-profile': { title: 'Profil bearbeiten', component: ProfileForm },
  'add-friend': { title: 'Freund*in hinzufügen', component: AddFriendForm },
  'delete-friend': { title: 'Freund*in entfernen', component: RemoveFriendForm },
} as const

export function useModal() {
  return useQueryState('modal', parseAsStringLiteral(modalPaths).withOptions({ history: 'push' }))
}

export const ModalProvider = () => {
  const [modal, setModal] = useModal()
  const close = () => setModal(null)

  if (!modal) {
    return null
  }

  const ModalComponent = modals[modal].component

  return (
    <Modal defaultOpen>
      <DialogTitle>{modals[modal].title}</DialogTitle>
      <ModalComponent isNew={modal?.startsWith('add')} close={close} />
    </Modal>
  )
}
