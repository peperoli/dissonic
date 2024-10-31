import { useDeleteLocation } from '@/hooks/locations/useDeleteLocation'
import { useParams } from 'next/navigation'
import { Button } from '../Button'

interface DeleteLocationFormProps {
  close: () => void
}

export const DeleteLocationForm = ({ close }: DeleteLocationFormProps) => {
  const { id: bandId } = useParams<{ id?: string }>()
  const { mutate, isPending } = useDeleteLocation()

  return (
    <div>
      <p>Willst du diese Location wirklich unwiderruflich löschen?</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Löschen"
          onClick={() => (bandId ? mutate(parseInt(bandId)) : null)}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
