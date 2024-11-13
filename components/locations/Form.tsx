import { useAddLocation } from '../../hooks/locations/useAddLocation'
import { AddLocation } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { useCountries } from '@/hooks/useCountries'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { AlertTriangleIcon, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { useParams } from 'next/navigation'
import { useLocation } from '@/hooks/locations/useLocation'
import { useEditLocation } from '@/hooks/locations/useEditLocation'
import { useLocations } from '@/hooks/locations/useLocations'
import { LocationItem } from './LocationItem'

interface FormProps {
  close: () => void
  isNew?: boolean
}

export const Form = ({ close, isNew }: FormProps) => {
  const { id: locationId } = useParams<{ id?: string }>()
  const { data: location } = useLocation(locationId ? parseInt(locationId) : null)
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<AddLocation>({
    defaultValues: isNew ? { name: '', zip_code: '', city: '' } : location,
  })
  const name = watch('name')
  const { data: similarLocations } = useLocations({
    enabled: name.length >= 3,
    search: name,
  })
  const addLocation = useAddLocation()
  const editLocation = useEditLocation()
  const { status } = isNew ? addLocation : editLocation
  const { data: countries } = useCountries()
  const isSimilar = !!(dirtyFields.name && similarLocations?.count)
  const regionNames = new Intl.DisplayNames(['de'], { type: 'region' })

  const onSubmit: SubmitHandler<AddLocation> = async function (formData) {
    if (isNew) {
      addLocation.mutate(formData)
    } else {
      editLocation.mutate(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <TextField
        {...register('name', { required: true })}
        error={errors.name}
        label="Name"
        placeholder="Hallenstadion"
      />
      {isSimilar && (
        <div className="rounded-lg bg-yellow/10 p-4">
          <div className="flex items-center gap-4 text-yellow">
            <AlertTriangleIcon className="size-icon flex-none" />
            <p>
              <strong>Achtung:</strong>{' '}
              {similarLocations.count === 1 ? 'Eine Location' : 'Folgende Locations'} mit ähnlichem Namen{' '}
              {similarLocations.count === 1 ? 'existiert' : 'existieren'} bereits:
            </p>
          </div>
          <ul className="mt-4 grid">
            {similarLocations.data.map(item => (
              <li key={item.id}>
                <LocationItem location={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-3">
        <TextField
          {...register('zip_code')}
          label="PLZ (optional)"
          placeholder="3000"
          grouped="start"
        />
        <div className="col-span-2">
          <TextField
            {...register('city', { required: true })}
            error={errors.city}
            label="Ort"
            placeholder="Zürich"
            grouped="end"
          />
        </div>
      </div>
      <Controller
        name="country_id"
        control={control}
        rules={{ required: true }}
        render={({ field: { value = null, onChange } }) => (
          <SelectField
            name="country_id"
            value={value}
            onValueChange={onChange}
            items={countries?.map(item => ({
              id: item.id,
              name: regionNames.of(item.iso2) ?? item.iso2,
            }))}
            error={errors.country_id}
            label="Land"
          />
        )}
      />
      <Disclosure>
        <DisclosurePanel>
          <TextField
            {...register('website')}
            label="Website (optional)"
            placeholder="https://hallenstadion.ch/"
          />
        </DisclosurePanel>
        <DisclosureButton as={Fragment}>
          {({ open }) => (
            <Button
              label={open ? 'Weniger anzeigen' : 'Mehr anzeigen'}
              icon={<ChevronDown className={clsx('size-icon', open && 'rotate-180')} />}
              size="small"
              appearance="tertiary"
            />
          )}
        </DisclosureButton>
      </Disclosure>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button onClick={close} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
    </form>
  )
}
