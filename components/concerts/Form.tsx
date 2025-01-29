import { AlertTriangle } from 'lucide-react'
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
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ConcertItem } from './ConcertItem'

type FormProps = {
  isNew?: boolean
  close: () => void
}

export const Form = ({ close, isNew }: FormProps) => {
  const { id: concertId } = useParams<{ id?: string }>()
  const { data: concert } = useConcert(concertId ? parseInt(concertId) : null)
  const today = new Date().toISOString().split('T')[0]
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddConcert>({
    defaultValues: isNew ? { is_festival: false, date_start: today } : concert,
  })
  const addConcert = useAddConcert()
  const editConcert = useEditConcert()
  const { status } = isNew ? addConcert : editConcert
  const [isOpen, setIsOpen] = useState(false)
  const dateStart = watch('date_start')
  const bands = watch('bands')
  const locationId = watch('location_id')
  const { data: similarConcerts } = useConcerts({
    enabled: !!(dateStart && bands?.length && locationId),
    years: dateStart
    ? [new Date(dateStart).getFullYear(), new Date(dateStart).getFullYear()]
    : null,
    bands: bands?.map(item => item.id),
    locations: locationId ? [locationId] : null,
  })
  const [locationsSearchQuery, setLocationsSearchQuery] = useState('')
  const [festivalRootsSearchQuery, setFestivalRootsSearchQuery] = useState('')
  const { data: locations } = useLocations({ search: locationsSearchQuery })
  const isFestival = watch('is_festival')
  const { data: festivalRoots } = useFestivalRoots({
    enabled: isFestival,
    search: festivalRootsSearchQuery,
    sort: { sort_by: 'name', sort_asc: true },
  })
  const t = useTranslations('ConcertForm')
  const festivalRootId = watch('festival_root_id')
  const isSimilar = !!(isNew && similarConcerts?.count)

  useEffect(() => {
    if (!festivalRootId || !isNew) return

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Controller
          name="is_festival"
          control={control}
          render={({ field: { value, onChange } }) => (
            <SegmentedControl
              options={[
                { value: 'false', label: t('concert') },
                { value: 'true', label: t('festival') },
              ]}
              value={String(value)}
              onValueChange={value => onChange(value === 'true')}
            />
          )}
        />
        {isFestival === true && (
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
                  searchable
                  searchQuery={festivalRootsSearchQuery}
                  setSearchQuery={setFestivalRootsSearchQuery}
                  error={errors.festival_root_id}
                  label={t('festivalRoot')}
                />
              )}
            />
            <div className="flex items-center">
              <p className="text-slate-300">{t('festivalRootMissing')}</p>
              <Button
                onClick={() => setIsOpen(true)}
                label={t('add')}
                icon={<Plus className="size-small" />}
                size="small"
                appearance="tertiary"
              />
            </div>
          </>
        )}
        <div className="flex">
          <TextField
            {...register('date_start', { required: true })}
            error={errors.date_start}
            type="date"
            label={isFestival ? t('startDate') : t('date')}
            grouped={isFestival ? 'start' : undefined}
          />
          {isFestival && (
            <TextField
              {...register('date_end', { required: true })}
              error={errors.date_end}
              type="date"
              label={t('endDate')}
              grouped="end"
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
              items={locations?.data.map(item => ({
                id: item.id,
                name: `${item.name}, ${item.city}`,
              }))}
              searchable
              searchQuery={locationsSearchQuery}
              setSearchQuery={setLocationsSearchQuery}
              error={errors.location_id}
              label={t('location')}
            />
          )}
        />
        {!isFestival && (
          <TextField
            {...register('name')}
            label={`${t('name')} ${t('optional')}`}
            placeholder="A Day in Smoke"
          />
        )}
        {isSimilar && (
          <div className="rounded-lg bg-yellow/10 p-4">
            <div className="flex items-center gap-4 text-yellow">
              <AlertTriangle className="size-icon flex-none" />
              <p>{t('duplicateConcertWarning', { count: similarConcerts.count })}</p>
            </div>
            <ul className="mt-4 grid">
              {similarConcerts.data.map(item => (
                <li key={item.id}>
                  <ConcertItem concert={item} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:static md:justify-end md:pb-0 [&>*]:flex-1">
          <Button onClick={close} label={t('cancel')} />
          <Button
            type="submit"
            label={t('save')}
            appearance="primary"
            loading={status === 'pending'}
          />
        </div>
      </form>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <FestivalRootForm close={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}
