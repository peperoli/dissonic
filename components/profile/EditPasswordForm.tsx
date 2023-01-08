import { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react'
import supabase from '../../utils/supabase'
import { Button } from '../Button'
import Modal from '../Modal'

interface EditPasswordFormProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const EditPasswordForm: FC<EditPasswordFormProps> = ({ isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false)

  async function updatePassword(event: SyntheticEvent) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      password: { value: string }
    }

    try {
      setLoading(true)
      const { error: updateError } = await supabase.auth.updateUser({
        password: target.password.value,
      })

      if (updateError) {
        throw updateError
      }

      setIsOpen(false)
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
      <h2>Passwort ändern</h2>
      <form onSubmit={updatePassword} className="grid gap-4">
        <div className="form-control">
          <input type="password" id="password" name="password" placeholder="" />
          <label htmlFor="password">Passwort</label>
        </div>
        <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
          <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
          <Button type="submit" label="Speichern" style="primary" loading={loading} />
        </div>
      </form>
    </Modal>
  )
}
