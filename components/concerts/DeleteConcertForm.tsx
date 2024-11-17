import { Button } from '../Button'
import { useParams } from 'next/navigation'
import { useDeleteConcert } from '@/hooks/concerts/useDeleteConcert'
import { useTranslations } from 'next-intl'

type DeleteConcertFormProps = {
  close: () => void
}

export const DeleteConcertForm = ({ close }: DeleteConcertFormProps) => {
  const { id: concertId } = useParams<{ id?: string }>()
  const { mutate, isPending } = useDeleteConcert()
  const t = useTranslations('DeleteConcertForm')
  return (
    <div>
      <p>{t('doYouReallyWantToDeleteThisConcert')}</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label={t('cancel')} onClick={close} />
        <Button
          label={t('delete')}
          onClick={() => (concertId ? mutate(parseInt(concertId)) : null)}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
