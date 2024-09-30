'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { Button } from '../Button'

export function LoadMoreButton() {
  const [_, setSize] = useQueryState(
    'size',
    parseAsInteger.withDefault(25).withOptions({ shallow: false })
  )
  return (
    <Button label="Mehr anzeigen" onClick={() => setSize(prev => prev + 25)} appearance="primary" />
  )
}
