import { useAddLocation } from '../../hooks/locations/useAddLocation'
import { AddLocation } from '../../types/types'
import { Button } from '../Button'
import { TextField } from '../forms/TextField'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { useCountries } from '@/hooks/useCountries'
import { Disclosure } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { useLocation } from '@/hooks/locations/useLocation'
import { useEditLocation } from '@/hooks/locations/useEditLocation'

interface FormProps {
  close: () => void
  isNew?: boolean
}

export const Form = ({ close, isNew }: FormProps) => {
  const pathname = usePathname()
  const locationId = !isNew ? pathname.split('/').pop() : null
  const { data: location } = useLocation(parseInt(locationId!))
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddLocation>({ defaultValues: location || {} })
  const addLocation = useAddLocation()
  const editLocation = useEditLocation()
  const { status } = isNew ? addLocation : editLocation
  const { data: countries } = useCountries()
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
      <h2 className="mb-0">{isNew ? 'Location hinzufügen' : 'Location bearbeiten'}</h2>
      <TextField
        {...register('name', { required: true })}
        error={errors.name}
        label="Name"
        placeholder="Hallenstadion"
      />
      <div className="grid grid-cols-3">
        <TextField
          {...register('zip_code', { required: true })}
          error={errors.zip_code}
          label="PLZ"
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
        <Disclosure.Panel>
          <TextField
            {...register('website')}
            label="Website (optional)"
            placeholder="https://hallenstadion.ch/"
          />
        </Disclosure.Panel>
        <Disclosure.Button as={Fragment}>
          {({ open }) => (
            <Button
              label={open ? 'Weniger anzeigen' : 'Mehr anzeigen'}
              icon={<ChevronDown className={clsx('size-icon', open && 'rotate-180')} />}
              size="small"
              appearance="tertiary"
            />
          )}
        </Disclosure.Button>
      </Disclosure>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
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
