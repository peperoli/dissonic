'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from '../Button'

export function LoadMoreButton() {
  const [_, setSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(50).withOptions({ shallow: false })
  )
  return (
    <div className="flex justify-center">
      <Button
        label="Mehr anzeigen"
        onClick={() => setSize(prev => prev + 50)}
        appearance="primary"
      />
    </div>
  )
}
