import supabase from '../../utils/supabase/client'
import { Button } from '../Button'
import Modal from '../Modal'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'

interface DeleteConcertModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeleteConcertModal = ({ isOpen, setIsOpen }: DeleteConcertModalProps) => {
  const { concert } = useConcertContext()
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  async function deleteConcert() {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Konzert löschen</h2>
      <p>Willst du dieses Konzert wirklich löschen?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Löschen" onClick={deleteConcert} appearance="primary" danger loading={loading} />
      </div>
    </Modal>
  )
}
