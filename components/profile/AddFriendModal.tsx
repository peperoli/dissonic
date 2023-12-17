import { Button } from '../Button'
import Modal from '../Modal'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Profile } from '../../types/types'
import { User } from '@supabase/supabase-js'
import { useAddFriend } from '../../hooks/useAddFriend'
import { useQueryClient } from '@tanstack/react-query'

type AddFriendModalProps = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  user: User
  profile: Profile
}

export const AddFriendModal = ({ isOpen, setIsOpen, user, profile }: AddFriendModalProps) => {
  const { mutate, status } = useAddFriend()
  const queryClient = useQueryClient()

  async function addFriend() {
    mutate({ sender_id: user.id, receiver_id: profile.id })
  }

  useEffect(() => {
    if (status === 'success') {
      queryClient.invalidateQueries(['friends', user.id])
      queryClient.invalidateQueries(['friends', profile.id])
      setIsOpen(false)
    }
  }, [status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Freund hizufügen</h2>
      <p>
        Willst du <span className="italic">{profile.username}</span> eine Freundschaftsanfrage
        schicken?
      </p>
      <div className="flex gap-4 [&>*]:flex-1 pt-5">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button
          label="Hinzufügen"
          onClick={addFriend}
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
    </Modal>
  )
}
