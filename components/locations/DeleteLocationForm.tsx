import { useDeleteLocation } from '@/hooks/locations/useDeleteLocation'
import { usePathname } from 'next/navigation'
import { Button } from '../Button'

interface DeleteLocationFormProps {
  close: () => void
}

export const DeleteLocationForm = ({ close }: DeleteLocationFormProps) => {
  const pathname = usePathname()
  const bandId = pathname.split('/').pop()
  const { mutate, isLoading } = useDeleteLocation()

  return (
    <>
      <h2>Location löschen</h2>
      <p>Willst du diese Location wirklich unwiderruflich löschen?</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Löschen"
          onClick={() => mutate(parseInt(bandId!))}
          appearance="primary"
          danger
          loading={isLoading}
        />
      </div>
    </>
  )
}
