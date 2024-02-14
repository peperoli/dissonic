import { Dispatch, SetStateAction, useEffect } from 'react'
import { EditConcert } from '../../types/types'
import Modal from '../Modal'
import { useEditConcert } from '../../hooks/concerts/useEditConcert'
import { useQueryClient } from '@tanstack/react-query'
import { useConcertContext } from '../../hooks/concerts/useConcertContext'
import { Form } from './Form'
import { SubmitHandler } from 'react-hook-form'

interface EditConcertFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditConcertForm = ({ isOpen, setIsOpen }: EditConcertFormProps) => {
  const { mutate, status } = useEditConcert()
  const { concert } = useConcertContext()
  const queryClient = useQueryClient()

  const onSubmit: SubmitHandler<EditConcert> = async function (formData) {
    mutate(formData)
  }

  const close = () => setIsOpen(false)

  useEffect(() => {
    if (status === 'success') {
      queryClient
        .invalidateQueries(['concert', concert.id])
        .catch(error => console.error(error))
        .finally(() => close())
    }
  }, [status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2 className="mb-8">Konzert bearbeiten</h2>
      <Form defaultValues={concert} onSubmit={onSubmit} status={status} close={close} />
    </Modal>
  )
}
