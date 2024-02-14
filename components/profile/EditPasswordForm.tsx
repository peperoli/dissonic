import { Dispatch, SetStateAction, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEditUser } from '../../hooks/auth/useEditUser'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import Modal from '../Modal'

interface EditPasswordFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditPasswordForm = ({ isOpen, setIsOpen }: EditPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({ mode: 'onChange' })
  const { mutate, status } = useEditUser()

  const onSubmit: SubmitHandler<{ password: string }> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      setIsOpen(false)
    }
  }, [status])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <h2>Passwort ändern</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <TextField
          {...register('password', {
            required: true,
            minLength: { value: 10, message: 'Das Passwort muss mindestens 10 Zeichen enthalten.' },
          })}
          error={errors.password}
          label="Passwort"
          type="password"
        />
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Speichern" appearance="primary" loading={status === 'loading'} />
        </div>
      </form>
    </Modal>
  )
}
