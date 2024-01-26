import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button } from '../Button'

interface PaginationProps {
  entriesCount: number
  currentPage: number
  onChange: (page: number) => void
  perPage: number
}

export const Pagination = ({ entriesCount, currentPage, onChange, perPage }: PaginationProps) => {
  const pagesCount = Math.ceil(entriesCount / perPage)
  const pages = Array.from(Array(pagesCount).keys())
  return (
    <div className="flex justify-between items-center gap-4 mt-4">
      <div className="text-sm text-slate-300">
        {entriesCount}&nbsp;{entriesCount === 1 ? 'Eintrag' : 'Einträge'}
      </div>
      <div className="hidden md:flex gap-2">
        {pagesCount > 1 &&
          pagesCount < 9 &&
          pages.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => onChange(item)}
              label={String(item + 1)}
              size="small"
              appearance={item === currentPage - 1 ? 'primary' : undefined}
            />
          ))}
      </div>
      {pagesCount > 1 && (
        <div className="rounded-lg bg-slate-700">
          <Button
            onClick={() => onChange(currentPage - 1)}
            contentType="icon"
            label="Vorherige Seite"
            icon={<ChevronLeftIcon className="h-icon" />}
            disabled={currentPage <= 1}
          />
          <Button
            onClick={() => onChange(currentPage + 1)}
            contentType="icon"
            label="Nächste Seite"
            icon={<ChevronRightIcon className="h-icon" />}
            disabled={currentPage >= pagesCount}
          />
        </div>
      )}
    </div>
  )
}
