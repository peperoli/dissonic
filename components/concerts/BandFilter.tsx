import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { useBands } from './../../hooks/bands/useBands'
import { Select } from '../forms/Select'
import { useTranslations } from 'next-intl'

type BandMultiSelectProps = {
  values: number[]
  onValuesChange: (value: number[]) => void
}

const BandMultiSelect = ({ ...props }: BandMultiSelectProps) => {
  const { data: bands, isPending } = useBands()
  return (
    <Select
      name="band"
      items={bands?.data}
      isLoading={isPending}
      multiple
      fixedHeight
      {...props}
    />
  )
}

type BandFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const BandFilter = ({ values: submittedValues, onSubmit }: BandFilterProps) => {
  const { data: bands } = useBands({ ids: submittedValues })
  const [selectedIds, setSelectedIds] = useState<number[]>(submittedValues ?? [])
  const t = useTranslations('BandFilter')

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label={t("band")}
      items={bands?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <BandMultiSelect values={selectedIds} onValuesChange={setSelectedIds} />
    </FilterButton>
  )
}
