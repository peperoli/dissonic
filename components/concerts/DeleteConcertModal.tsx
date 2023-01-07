import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'
import React, { FC } from 'react'
import { useRouter } from 'next/navigation'
import { ConcertWithBands } from '../../models/types'

interface DeleteConcertModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  concert: ConcertWithBands
}

export const DeleteConcertModal: FC<DeleteConcertModalProps> = ({ isOpen, setIsOpen, concert }) => {
  const router = useRouter()

  async function deleteConcert() {
    try {
      const { error: deleteBandsSeenError } = await supabase
        .from('j_bands_seen')
        .delete()
        .eq('concert_id', concert.id)

      if (deleteBandsSeenError) {
        throw deleteBandsSeenError
      }

      const { error: deleteBandsError } = await supabase
        .from('j_concert_bands')
        .delete()
        .eq('concert_id', concert.id)

      if (deleteBandsError) {
        throw deleteBandsError
      }

      const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .eq('concert_id', concert.id)

      if (deleteCommentsError) {
        throw deleteCommentsError
      }

      const { error: deleteConcertError } = await supabase
        .from('concerts')
        .delete()
        .eq('id', concert.id)

      if (deleteConcertError) {
        throw deleteConcertError
      }

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Oops')
        console.error(error)
      }
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Konzert löschen</h2>
      <p>Willst du dieses Konzert wirklich löschen?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Löschen" onClick={deleteConcert} style="primary" danger />
      </div>
    </Modal>
  )
}
