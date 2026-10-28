import { Control, Controller, FieldError, Merge } from 'react-hook-form'
import { SelectField } from '../forms/SelectField'
import { useState } from 'react'
import { useSearchGenres } from '@/hooks/genres/useSearchGenres'
import { BandFields } from './Form'

export function GenresSelectField({
  control,
  ...props
}: {
  control: Control<BandFields, unknown, BandFields>
  label: string
  error?: Merge<FieldError, unknown>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [size, setSize] = useState(50)
  const { data: genres } = useSearchGenres({ search: searchQuery, size })

  return (
    <Controller
      name="genres"
      control={control}
      render={({ field: { value = [], onChange } }) => (
        <SelectField
          name="genres"
          items={genres?.data ?? []}
          multiple
          values={value}
          onValuesChange={onChange}
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
