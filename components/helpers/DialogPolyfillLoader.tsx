'use client'

import { useEffect } from 'react'

export function DialogPolyfillLoader() {
  useEffect(() => {
    import('dialog-closedby-polyfill')
  }, [])

  return null
}
