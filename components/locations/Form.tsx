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
import { Fragment, useState } from 'react'
import { useParams } from 'next/navigation'
import { useLocation } from '@/hooks/locations/useLocation'
import { useEditLocation } from '@/hooks/locations/useEditLocation'
import { useLocations } from '@/hooks/locations/useLocations'
import { LocationItem } from './LocationItem'
import { useLocale, useTranslations } from 'next-intl'
import { FileInput } from '../forms/FileInput'
import { getAssetUrl } from '@/lib/getAssetUrl'

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
  } = useForm<AddLocation & { imageFile: File | string | null }>({
    defaultValues: isNew
      ? { name: '', zip_code: '', city: '' }
      : {
          ...location,
          imageFile: location?.image
            ? getAssetUrl('ressources', location.image, location.updated_at)
            : null,
        },
  })
  const name = watch('name')
  const { data: similarLocations } = useLocations({
    enabled: name.length >= 3,
    search: name,
  })
  const [countriesSearchQuery, setCountriesSearchQuery] = useState('')
  const { data: countries } = useCountries({ search: countriesSearchQuery })
  const { data: allCountries } = useCountries()
  const addLocation = useAddLocation()
  const editLocation = useEditLocation()
  const { status } = isNew ? addLocation : editLocation
  const t = useTranslations('LocationForm')
  const locale = useLocale()
  const isSimilar = !!(dirtyFields.name && similarLocations?.count)
  const fileTypes = ['image/jpeg', 'image/webp']
  const regionNames = new Intl.DisplayNames(locale, { type: 'region' })

  const onSubmit: SubmitHandler<AddLocation & { imageFile: File | string | null }> =
    async function (formData) {
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
        label={t('name')}
        placeholder="Hallenstadion"
      />
      {isSimilar && (
        <div className="rounded-lg bg-yellow/10 p-4">
          <div className="flex items-center gap-4 text-yellow">
            <AlertTriangleIcon className="size-icon flex-none" />
            <p>{t('duplicateLocationWarning', { count: similarLocations.count })}</p>
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
      <Controller
        name="imageFile"
        control={control}
        rules={{
          validate: {
            fileSize: value =>
              !(value instanceof File) || value.size < 1024 * 1024 || t('fileSizeError'),
            fileType: value =>
              !(value instanceof File) || fileTypes.includes(value.type) || t('fileTypeError'),
          },
        }}
        render={({ field }) => (
          <FileInput
            label={t('image') + ' (optional)'}
            accept={fileTypes.join(',')}
            error={errors.imageFile}
            {...field}
          />
        )}
      />
      <div className="grid grid-cols-3">
        <TextField
          {...register('zip_code')}
          label={t('zipCode') + ' (optional)'}
          placeholder="3000"
          grouped="start"
        />
        <div className="col-span-2">
          <TextField
            {...register('city', { required: true })}
            error={errors.city}
            label={t('city')}
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
            allItems={allCountries?.map(item => ({
              id: item.id,
              name: regionNames.of(item.iso2) ?? item.iso2,
            }))}
            searchable
            searchQuery={countriesSearchQuery}
            setSearchQuery={setCountriesSearchQuery}
            error={errors.country_id}
            label={t('country')}
          />
        )}
      />
      <Disclosure>
        <DisclosurePanel className="grid gap-6">
          <TextField {...register('alt_names')} label={`${t('altNames')} ${t('optional')}`} />
          <TextField
            {...register('website')}
            label={`${t('website')} ${t('optional')}`}
            placeholder="https://hallenstadion.ch/"
          />
        </DisclosurePanel>
        <DisclosureButton as={Fragment}>
          {({ open }) => (
            <Button
              label={open ? t('showLess') : t('showMore')}
              icon={<ChevronDown className={clsx('size-icon', open && 'rotate-180')} />}
              size="small"
              appearance="tertiary"
            />
          )}
        </DisclosureButton>
      </Disclosure>
      <div className="sticky bottom-0 z-10 flex gap-4 bg-slate-800 py-4 md:justify-end [&>*]:flex-1">
        <Button onClick={close} label={t('cancel')} />
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          loading={status === 'pending'}
        />
      </div>
    </form>
  )
}
