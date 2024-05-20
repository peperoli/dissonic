'use client'

import clsx from 'clsx'
import { SortAsc, SortDesc } from 'lucide-react'
import { parseAsBoolean, parseAsString, useQueryStates } from 'nuqs'

type HeaderCellProps = {
  label: string
  value?: string
  textAlign?: 'left' | 'center' | 'right'
}

export function HeaderCell({ label, value, textAlign = 'left' }: HeaderCellProps) {
  const [sort, setSort] = useQueryStates(
    {
      sort_by: parseAsString,
      sort_asc: parseAsBoolean.withDefault(false),
    },
    { shallow: false }
  )

  function handleSort() {
    setSort({
      sort_by: value,
      sort_asc: sort.sort_by === value ? !sort.sort_asc : true,
    })
  }

  return (
    <th className={clsx('p-2 pr-6')}>
      <button
        onClick={handleSort}
        className={clsx(
          'relative flex w-full',
          textAlign === 'center' && 'justify-center',
          textAlign === 'right' && 'justify-end'
        )}
      >
        {label}
        {value && (
          <div className={clsx('absolute -right-2 translate-x-full', sort.sort_by !== value && 'invisible')}>
            {sort.sort_asc ? (
              <SortAsc className="size-icon text-slate-300" />
            ) : (
              <SortDesc className="size-icon text-slate-300" />
            )}
          </div>
        )}
      </button>
    </th>
  )
}
