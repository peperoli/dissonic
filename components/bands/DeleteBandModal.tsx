import { useRouter } from "next/navigation"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { Band } from "../../models/types"
import supabase from "../../utils/supabase"
import { Button } from "../Button"
import Modal from "../Modal"

interface DeleteBandModalProps {
  band: Band
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const DeleteBandModal: FC<DeleteBandModalProps> = ({ band, isOpen, setIsOpen }) => {
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  async function deleteBand() {
    try {
      setLoading(true)
      const { error: genresError } = await supabase
        .from('j_band_genres')
        .delete()
        .eq('band_id', band.id)

      if (genresError) {
        throw genresError
      }

      const { error: bandError } = await supabase.from('bands').delete().eq('id', band.id)

      if (bandError) {
        throw bandError
      }

      router.push('/bands')
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
    <div>
      <h2>Band löschen</h2>
      <p>Willst du die Band wirklich unwiderruflich löschen?</p>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 bg-slate-800 z-10">
        <Button label="Abbrechen" onClick={() => setIsOpen(false)} />
        <Button label="Löschen" onClick={deleteBand} style="primary" danger loading={loading} />
      </div>
    </div>
  </Modal>
  )
}