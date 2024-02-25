import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { useLocations } from '../../hooks/locations/useLocations'
import { AddConcert, EditConcert, ReorderableListItem } from '../../types/types'
import { Button } from '../Button'
import { CheckBox } from '../forms/CheckBox'
import { TextField } from '../forms/TextField'
import { EditBandsButton } from './EditBandsButton'
import { SelectField } from '../forms/SelectField'

interface FormProps {
  defaultValues?: EditConcert
  onSubmit: SubmitHandler<AddConcert> | SubmitHandler<EditConcert>
  status: 'idle' | 'loading' | 'error' | 'success'
  close: () => void
}

export const Form = ({ defaultValues, onSubmit, status, close }: FormProps) => {
  const [today] = new Date().toISOString().split('T')
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddConcert>({
    defaultValues: defaultValues ?? { date_start: today },
  })
  const { data: concerts } = useConcerts()
  const { data: locations } = useLocations()

  const similarConcerts = concerts?.data
    .filter(item => item.date_start === watch('date_start'))
    .filter(item =>
      item.bands?.find(band => watch('bands')?.find(selectedBand => band.id === selectedBand.id))
    )
    .filter(item => item.location?.id === Number(watch('location_id')))
  const isSimilar = !defaultValues && similarConcerts && similarConcerts.length > 0
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField {...register('name')} label="Name (optional)" placeholder="Greenfield" />
      <CheckBox {...register('is_festival')} label="Festival" />
      <div className="flex gap-4">
        <TextField
          {...register('date_start', { required: true })}
          error={errors.date_start}
          type="date"
          label={watch('is_festival') ? 'Startdatum' : 'Datum'}
        />
        {watch('is_festival') && (
          <TextField
            {...register('date_end', { required: true })}
            error={errors.date_end}
            type="date"
            label="Enddatum"
          />
        )}
      </div>
      <Controller
        name="bands"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = [], onChange } }) => (
          <EditBandsButton
            value={value as ReorderableListItem[]}
            onChange={onChange as (value: ReorderableListItem[]) => void}
            error={errors.bands}
          />
        )}
      />
      <Controller
        name="location_id"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <SelectField
            name="location_id"
            value={value}
            onValueChange={onChange}
            items={locations?.data.map(item => ({ id: item.id, name: item.name }))}
            error={errors.location_id}
            label="Location"
          />
        )}
      />
      {isSimilar && (
        <div className="rounded-lg bg-yellow/10 p-4">
          <div className="flex items-center gap-4 text-yellow">
            <ExclamationTriangleIcon className="h-icon flex-none" />
            <p>
              <strong>Achtung:</strong>{' '}
              {similarConcerts.length === 1 ? 'Ein Konzert' : 'Folgende Konzerte'} mit ähnlichen
              Eigenschaften {similarConcerts.length === 1 ? 'existiert' : 'existieren'} bereits:
            </p>
          </div>
          <div className="mt-4 grid gap-2">
            {similarConcerts.map(item => (
              <Link
                key={item.id}
                href={`/concerts/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md bg-slate-800 px-4 py-2 shadow-lg hover:bg-slate-750"
              >
                <div>{new Date(item.date_start).toLocaleDateString('de-CH')}</div>
                <div className="font-bold">
                  {item.bands
                    ?.slice(0, 10)
                    .map(band => band.name)
                    .join(', ')}
                </div>
                <div>@ {item.location?.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:static md:justify-end md:pb-0 [&>*]:flex-1">
        <Button onClick={close} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'loading'}
        />
      </div>
    </form>
  )
}
