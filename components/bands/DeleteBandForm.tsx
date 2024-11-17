import { useDeleteBand } from '@/hooks/bands/useDeleteBand'
import { useParams } from 'next/navigation'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

interface DeleteBandFormProps {
  close: () => void
}

export const DeleteBandForm = ({ close }: DeleteBandFormProps) => {
  const { id: bandId } = useParams<{ id?: string }>()
  const { mutate, isPending } = useDeleteBand()
  const t = useTranslations('DeleteBandForm')

  return (
    <div>
      <p>{t('doYouReallyWantToDeleteThisBand')}</p>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button label={t('cancel')} onClick={close} />
        <Button
          label={t('delete')}
          onClick={() => (bandId ? mutate(parseInt(bandId)) : null)}
          appearance="primary"
          danger
          loading={isPending}
        />
      </div>
    </div>
  )
}
