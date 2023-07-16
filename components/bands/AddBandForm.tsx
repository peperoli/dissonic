import { Dispatch, SetStateAction } from 'react'
import { useAddBand } from '../../hooks/useAddBand'
import { AddBand } from '../../types/types'
import Modal from '../Modal'
import { Form } from './Form'
import { SubmitHandler } from 'react-hook-form'

interface AddBandFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const AddBandForm = ({ isOpen, setIsOpen }: AddBandFormProps) => {
  const { mutate, status } = useAddBand()

  const onSubmit: SubmitHandler<AddBand> = async function (formData) {
    mutate(formData)
  }

  const close = () => setIsOpen(false)

  if (status === 'success') {
    setIsOpen(false)
  }
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Band erstellen</h2>
      <Form
        onSubmit={onSubmit}
        status={status}
        close={close}
      />
    </Modal>
  )
}
