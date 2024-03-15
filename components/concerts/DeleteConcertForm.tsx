import { Button } from '../Button'
import { usePathname } from 'next/navigation'
import { useDeleteConcert } from '@/hooks/concerts/useDeleteConcert'

type DeleteConcertFormProps = {
  close: () => void
}

export const DeleteConcertForm = ({ close }: DeleteConcertFormProps) => {
  const pathname = usePathname()
  const concertId = pathname.split('/').pop()
  const { mutate, isLoading } = useDeleteConcert()
  return (
    <>
      <h2>Konzert löschen</h2>
      <p>Willst du dieses Konzert wirklich löschen?</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Löschen"
          onClick={() => mutate(concertId!)}
          appearance="primary"
          danger
          loading={isLoading}
        />
      </div>
    </>
  )
}
