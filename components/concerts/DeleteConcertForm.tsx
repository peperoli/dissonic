import { Button } from '../Button'
import { usePathname } from 'next/navigation'
import { useDeleteConcert } from '@/hooks/concerts/useDeleteConcert'

type DeleteConcertFormProps = {
  close: () => void
}

export const DeleteConcertForm = ({ close }: DeleteConcertFormProps) => {
  const pathname = usePathname()
  const concertId = pathname.split('/').pop()
  const { mutate, isPending } = useDeleteConcert()
  return (
    <div>
      <p>Willst du dieses Konzert wirklich löschen?</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label="Abbrechen" onClick={close} />
        <Button
          label="Löschen"
          onClick={() => mutate(parseInt(concertId!))}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
