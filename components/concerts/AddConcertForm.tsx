import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useAddConcert } from '../../hooks/useAddConcert'
import { AddConcert } from '../../types/types'
import Modal from '../Modal'
import { Form } from './Form'

interface AddConcertFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddConcertForm = ({ isOpen, setIsOpen }: AddConcertFormProps) => {
  const { mutate, data, status } = useAddConcert()
  const router = useRouter()

  const onSubmit: SubmitHandler<AddConcert> = async function (formData) {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      router.push(`/concerts/${data.id}`)
    }
  }, [status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2 className="mb-8">Konzert hinzufügen</h2>
      <Form onSubmit={onSubmit} status={status} close={() => setIsOpen(false)} />
    </Modal>
  )
}
