import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { useLocations } from '../../hooks/locations/useLocations'
import { AddConcert, ReorderableListItem } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { EditBandsButton } from './EditBandsButton'
import { SelectField } from '../forms/SelectField'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useFestivalRoots } from '@/hooks/concerts/useFestivalRoots'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Modal from '../Modal'
import { FestivalRootForm } from './FestivalRootForm'
import { useAddConcert } from '@/hooks/concerts/useAddConcert'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditConcert } from '@/hooks/concerts/useEditConcert'
import { usePathname, useRouter } from 'next/navigation'

type FormProps = {
  isNew?: boolean
  close: () => void
}

export const Form = ({ close, isNew }: FormProps) => {
  const pathname = usePathname()
  const concertId = !isNew ? pathname.split('/').pop() : null
  const { data: concert } = useConcert(null, concertId ?? null)
  const today = new Date().toISOString().split('T')[0]
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddConcert>({
    defaultValues: concert ?? { is_festival: false, date_start: today },
  })
  const addConcert = useAddConcert()
  const editConcert = useEditConcert()
  const { status } = isNew ? addConcert : editConcert
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { data: concerts } = useConcerts()
  const { data: locations } = useLocations()
  const isFestival = watch('is_festival')
  const { data: festivalRoots } = useFestivalRoots(isFestival)
  const festivalRootId = watch('festival_root_id')

  const similarConcerts = concerts?.data
    .filter(item => item.date_start === watch('date_start'))
    .filter(item =>
      item.bands?.find(band => watch('bands')?.find(selectedBand => band.id === selectedBand.id))
    )
    .filter(item => item.location?.id === Number(watch('location_id')))
  const isSimilar = isNew && similarConcerts && similarConcerts.length > 0

  useEffect(() => {
    if (isNew && status === 'success') {
      router.push(`/concerts/${addConcert.data?.id}`)
    }
  }, [status])

  useEffect(() => {
    if (!festivalRootId) return

    const defaultLocationId = festivalRoots?.find(
      item => item.id === festivalRootId
    )?.default_location_id

    if (!defaultLocationId) return

    setValue('location_id', defaultLocationId)
  }, [festivalRootId])

  const onSubmit: SubmitHandler<AddConcert> = async function (formData) {
    if (isNew) {
      addConcert.mutate(formData)
    } else {
      editConcert.mutate(formData)
    }
  }
  return (
    <>
      <h2 className="mb-8">{isNew ? 'Konzert hinzufügen' : 'Konzert bearbeiten'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Controller
          name="is_festival"
          control={control}
          render={({ field: { value, onChange } }) => (
            <SegmentedControl
              options={[
                { value: 'false', label: 'Konzert' },
                { value: 'true', label: 'Festival' },
              ]}
              value={String(value)}
              onValueChange={value => onChange(value === 'true')}
            />
          )}
        />
        {isFestival === true ? (
          <>
            <Controller
              name="festival_root_id"
              control={control}
              rules={{ required: true }}
              render={({ field: { value = null, onChange } }) => (
                <SelectField
                  name="festival_root_id"
                  items={festivalRoots}
                  value={value}
                  onValueChange={onChange}
                  error={errors.festival_root_id}
                  label="Festival-Stamm"
                />
              )}
            />
            <div className="flex items-center">
              <p className="text-slate-300">Festival-Stamm fehlt?</p>
              <Button
                onClick={() => setIsOpen(true)}
                label="Hinzufügen"
                icon={<Plus className="size-small" />}
                size="small"
                appearance="tertiary"
              />
            </div>
          </>
        ) : (
          <TextField {...register('name')} label="Name (optional)" placeholder="Greenfield" />
        )}
        <div className="flex gap-4">
          <TextField
            {...register('date_start', { required: true })}
            error={errors.date_start}
            type="date"
            label={isFestival ? 'Startdatum' : 'Datum'}
          />
          {isFestival && (
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
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <FestivalRootForm close={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}
