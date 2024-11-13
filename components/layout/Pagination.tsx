import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '../Button'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  entriesCount: number
  perPage: number
}

export function usePagination() {
  return useQueryState('page', parseAsInteger.withDefault(1).withOptions({ scroll: true }))
}

export const Pagination = ({ entriesCount, perPage }: PaginationProps) => {
  const [currentPage, setCurrentPage] = usePagination()
  const t = useTranslations('Pagination')
  const pagesCount = Math.ceil(entriesCount / perPage)
  const pages = Array.from(Array(pagesCount).keys())
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <div className="text-sm text-slate-300">
        {t('nEntries', { count: entriesCount })}
      </div>
      <div className="hidden gap-2 md:flex">
        {pagesCount > 1 &&
          pagesCount < 9 &&
          pages.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => setCurrentPage(item + 1)}
              label={String(item + 1)}
              size="small"
              appearance={item === currentPage - 1 ? 'primary' : undefined}
            />
          ))}
      </div>
      {pagesCount > 1 && (
        <div className="rounded-lg bg-slate-700">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            contentType="icon"
            label={t('previousPage')}
            icon={<ChevronLeftIcon className="size-icon" />}
            disabled={currentPage <= 1}
          />
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            contentType="icon"
            label={t('nextPage')}
            icon={<ChevronRightIcon className="size-icon" />}
            disabled={currentPage >= pagesCount}
          />
        </div>
      )}
    </div>
  )
}
