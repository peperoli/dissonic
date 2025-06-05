'use client'

import { Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import Modal from '../Modal'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { SearchForm } from '../layout/SearchForm'
import clsx from 'clsx'
import { ConcertLogForm } from '../concerts/ConcertLogForm'

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
  () => import('../profile/RemoveFriendForm').then(mod => mod.RemoveFriendForm),
  { loading: () => <Loader /> }
)

export const modalPaths = [
  'add-concert',
  'edit-concert',
  'delete-concert',
  'add-log',
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
  'search',
] as const

export function useModal() {
  return useQueryState('modal', parseAsStringLiteral(modalPaths).withOptions({ history: 'push' }))
}

export const ModalProvider = () => {
  const [modal, setModal] = useModal()
  const t = useTranslations('ModalProvider')
  const modals = {
    'add-concert': { title: t('addConcert'), component: ConcertForm },
    'edit-concert': { title: t('editConcert'), component: ConcertForm },
    'delete-concert': { title: t('deleteConcert'), component: DeleteConcertForm },
    'add-log': { title: t('addLog'), component: ConcertLogForm },
    'delete-comment': { title: t('deleteComment'), component: DeleteCommentForm },
    'add-band': { title: t('addBand'), component: BandForm },
    'edit-band': { title: t('editBand'), component: BandForm },
    'delete-band': { title: t('deleteBand'), component: DeleteBandForm },
    'add-location': { title: t('addLocation'), component: LocationForm },
    'edit-location': { title: t('editLocation'), component: LocationForm },
    'delete-location': { title: t('deleteLocation'), component: DeleteLocationForm },
    'edit-profile': { title: t('editProfile'), component: ProfileForm },
    'add-friend': { title: t('addFriend'), component: AddFriendForm },
    'delete-friend': { title: t('removeFriend'), component: RemoveFriendForm },
    search: { title: t('search'), component: SearchForm },
  } as const
  const close = () => setModal(null)

  const ModalContent = modal && modals[modal]?.component
  const title = modal && modals[modal]?.title

  return (
    <Modal
      open={modal !== null && !!modals[modal]}
      onOpenChange={isOpen => !isOpen && close()}
      closeOnClickOutside={modal === 'search'}
    >
      <DialogTitle className={clsx(modal === 'search' && 'sr-only')}>{title}</DialogTitle>
      {ModalContent && <ModalContent isNew={modal?.startsWith('add')} close={close} />}
    </Modal>
  )
}
