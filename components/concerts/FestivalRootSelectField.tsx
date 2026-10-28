import { Control, Controller, FieldError, Merge } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { useState } from 'react'
import { ConcertFields } from './Form'
import { useSearchFestivalRoots } from '@/hooks/festival-roots/useSearchFestivalRoots'

export function FestivalRootSelectField({
  control,
  ...props
}: {
  control: Control<ConcertFields, unknown, ConcertFields>
  error?: Merge<FieldError, unknown>
  label: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [size, setSize] = useState(50)
  const { data: festivalRoots } = useSearchFestivalRoots({ search: searchQuery, size })

  return (
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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onScrollToEnd={() => setSize(prevSize => prevSize + 50)}
          {...props}
        />
      )}
    />
  )
}
