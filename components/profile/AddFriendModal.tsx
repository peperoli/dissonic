import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'
import React, { FC, useState } from 'react'
import { Profile } from '../../models/types'
import { User } from '@supabase/supabase-js'

interface IAddFriendModal {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  user: User
  profile: Profile
}

export const AddFriendModal: FC<IAddFriendModal> = ({ isOpen, setIsOpen, user, profile }) => {
  const [loading, setLoading] = useState(false)
  
  async function addFriend() {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('friends')
        .insert({ sender_id: user.id, receiver_id: profile.id })

      if (error) {
        throw error
      }
      setIsOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error('Unexpected error', error)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Freund hizufügen</h2>
      <p>
        Willst du <span className="italic">{profile.username}</span> eine Freundschaftsanfrage
        schicken?
      </p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Hinzufügen" onClick={addFriend} style="primary" loading={loading} />
      </div>
    </Modal>
  )
}
