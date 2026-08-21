import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { useLocations } from '../../hooks/locations/useLocations'
import { AddConcert, Band, ListItem, ReorderableListItem } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { EditBandsButton } from './EditBandsButton'
import { SelectField } from '../forms/SelectField'
import { SegmentedControl } from '../controls/SegmentedControl'
import { useFestivalRoots } from '@/hooks/concerts/useFestivalRoots'
import { useEffect, useState } from 'react'
import { ChevronDownIcon, Plus } from 'lucide-react'
import { Modal } from '../Modal'
import { FestivalRootForm } from './FestivalRootForm'
import { useAddConcert } from '@/hooks/concerts/useAddConcert'
import { useConcert } from '@/hooks/concerts/useConcert'
import { useEditConcert } from '@/hooks/concerts/useEditConcert'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Temporal } from 'temporal-polyfill'
import { SimilarItemsWarning } from '../shared/SimilarItemsWarning'
import { useSession } from '@/hooks/auth/useSession'
import { Disclosure } from '../shared/Disclosure'
import clsx from 'clsx'
import { RadioButton } from '../forms/RadioGroup'
import { isValidDate } from '@/lib/date'
import { useLocation } from '@/hooks/locations/useLocation'

export type ConcertFields = {
  id: AddConcert['id']
  name: AddConcert['name']
  is_festival: AddConcert['is_festival']
  festival_root: ListItem | null
  date_start: AddConcert['date_start']
  date_end: AddConcert['date_end']
  doors_time: AddConcert['doors_time']
  show_time: AddConcert['show_time']
  bands: ReorderableListItem<Band>[]
  location: ListItem
  source_link: AddConcert['source_link']
  resource_status: AddConcert['resource_status']
}

export function Form({ close, isNew }: { isNew?: boolean; close: () => void }) {
  const { id: concertId } = useParams<{ id?: string }>()
  const { data: concert } = useConcert(concertId ? parseInt(concertId) : null)
  const today = Temporal.Now.plainDateISO().toString()
  const defaultValues: Partial<ConcertFields> = isNew
    ? { is_festival: false, date_start: today }
    : {
        ...concert,
        bands: concert?.bands.map(band => ({
          ...band,
          item_index: band.item_index ?? null,
        })),
        location: concert?.location
          ? {
              id: concert.location.id,
              name: `${concert.location.name}, ${concert.location.city}`,
            }
          : undefined,
        festival_root: concert?.festival_root
          ? {
              id: concert.festival_root.id,
              name: concert.festival_root.name,
            }
          : null,
      }
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    // @ts-expect-error - type instantiation issue with useForm and defaultValues
  } = useForm<ConcertFields>({
    defaultValues,
  })
  const addConcert = useAddConcert()
  const editConcert = useEditConcert()
  const { status } = isNew ? addConcert : editConcert
  const [isOpen, setIsOpen] = useState(false)
  const dateStart = isValidDate(watch('date_start'))
    ? Temporal.PlainDate.from(watch('date_start'))
    : null
  const isFutureOrToday =
    !!dateStart && Temporal.PlainDate.compare(dateStart, Temporal.Now.plainDateISO()) >= 0
  const bands = watch('bands')
  const location = watch('location')
  const [similarConcertsSize, setSimilarConcertsSize] = useState(3)
  const { data: similarConcerts } = useConcerts({
    enabled: !!(dateStart && bands?.length && location),
    years: dateStart ? [dateStart.year, dateStart.year] : null,
    bands: bands?.map(item => item.id),
    locations: location ? [location.id] : null,
    size: similarConcertsSize,
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
  const { data: session } = useSession()
  const festivalRoot = watch('festival_root')
  const isSimilar = !!(isNew && similarConcerts?.count)
  const isMod = session?.user_role === 'developer' || session?.user_role === 'moderator'
  const resourceStatusItems = [
    { value: 'complete', label: t('complete') },
    { value: 'incomplete_lineup', label: t('incompleteLineup') },
  ]
  const defaultLocationId =
    festivalRoot && 'default_location_id' in festivalRoot
      ? (festivalRoot.default_location_id as number)
      : null
  const { data: defaultLocation } = useLocation(defaultLocationId, null, !!festivalRoot)

  useEffect(() => {
    if (!isNew || !festivalRoot || !defaultLocation) return

    setValue('location', defaultLocation)
  }, [festivalRoot?.id, defaultLocation?.id])

  const onSubmit: SubmitHandler<ConcertFields> = async function (formData) {
    if (isNew) {
      addConcert.mutate(formData)
    } else {
      editConcert.mutate(formData)
    }
  }

  function FutureConcertFields() {
    return (
      <>
        <div className="flex">
          <TextField
            type="time"
            {...register('doors_time')}
            step={300}
            label={`${t('doorsTime')} ${t('optional')}`}
            placeholder="18:30"
            grouped="start"
          />
          <TextField
            type="time"
            {...register('show_time')}
            step={300}
            label={`${t('showTime')} ${t('optional')}`}
            placeholder="19:00"
            grouped="end"
          />
        </div>
        <TextField
          {...register('source_link')}
          label={`${t('sourceLink')} ${t('optional')}`}
          placeholder="https://example.com"
        />
      </>
    )
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
              name="festival_root"
              control={control}
              rules={{ required: true }}
              render={({ field: { value = null, onChange } }) => (
                <SelectField
                  name="festival_root"
                  items={festivalRoots?.data ?? []}
                  value={value}
                  onValueChange={onChange}
                  searchable
                  searchQuery={festivalRootsSearchQuery}
                  setSearchQuery={setFestivalRootsSearchQuery}
                  error={errors.festival_root}
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
            <EditBandsButton value={value} onChange={onChange} error={errors.bands} />
          )}
        />
        <Controller
          name="location"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <SelectField
              name="location_id"
              value={value}
              onValueChange={onChange}
              items={
                locations?.data.map(item => ({
                  id: item.id,
                  name: `${item.name}, ${item.city}`,
                })) ?? []
              }
              searchable
              searchQuery={locationsSearchQuery}
              setSearchQuery={setLocationsSearchQuery}
              error={errors.location}
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
          <SimilarItemsWarning
            itemType="concerts"
            similarItems={similarConcerts}
            similarItemsSize={similarConcertsSize}
            setSimilarItemsSize={setSimilarConcertsSize}
          />
        )}
        {isFutureOrToday ? (
          <FutureConcertFields />
        ) : (
          <Disclosure.Root>
            <Disclosure.Trigger className="btn btn-small btn-tertiary">
              {({ isOpen }) => (
                <>
                  {isOpen ? t('showLess') : t('showMore')}
                  <ChevronDownIcon className={clsx('size-icon', isOpen && 'rotate-180')} />
                </>
              )}
            </Disclosure.Trigger>
            <Disclosure.Content className="mt-3 grid gap-6">
              <FutureConcertFields />
            </Disclosure.Content>
          </Disclosure.Root>
        )}
        {isMod && (
          <Controller
            name="resource_status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <fieldset>
                <legend className="mb-1 text-sm text-slate-300">{t('resourceStatus')}</legend>
                <ul className="w-full">
                  {resourceStatusItems.map(item => (
                    <li key={item.value}>
                      <label className="flex w-full items-center gap-3 rounded px-2 py-1.5 hover:bg-slate-600">
                        <RadioButton
                          name="resource_status"
                          value={item.value}
                          isChecked={value === item.value}
                          onCheckedChange={isChecked =>
                            isChecked ? onChange(item.value) : undefined
                          }
                        />
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}
          />
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
      <Modal isOpen={isOpen} setOpen={setIsOpen}>
        <FestivalRootForm close={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}
