import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect } from 'react'
import { FC } from 'react'
import { Button } from '../Button'

interface PaginationProps {
  entriesCount: number
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  perPage: number
}

export const Pagination: FC<PaginationProps> = ({
  entriesCount,
  currentPage,
  setCurrentPage,
  perPage,
}) => {
  const pagesCount = Math.ceil(entriesCount / perPage)
  const pages = Array.from(Array(pagesCount).keys())

  useEffect(() => {
    setCurrentPage(0)
  }, [entriesCount])
  return (
    <div className="flex justify-between items-center gap-4 mt-4">
      <div className="text-slate-300">{entriesCount} Einträge</div>
      <div className="flex gap-2">
        {(pagesCount > 1 && pagesCount < 5) &&
          pages.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => setCurrentPage(item)}
              label={String(item + 1)}
              size="small"
              style={item === currentPage ? 'primary' : undefined}
            />
          ))}
      </div>
      {pagesCount > 1 && (
        <div className="rounded-lg bg-slate-700">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            contentType="icon"
            label="Vorherige Seite"
            icon={<ChevronLeftIcon className="h-icon" />}
            disabled={currentPage <= 0}
          />
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            contentType="icon"
            label="Nächste Seite"
            icon={<ChevronRightIcon className="h-icon" />}
            disabled={currentPage + 1 >= pagesCount}
          />
        </div>
      )}
    </div>
  )
}
