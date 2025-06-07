'use server'

import { cookies } from 'next/headers'

const YEAR = 60 * 60 * 24 * 365.25

export async function setViewPreference(userView: 'global' | 'friends' | 'user') {
  const cookieStore = await cookies()
  cookieStore.set('concertsUserView', userView, {
    maxAge: YEAR,
  })
}

export async function setConcertsRangePreference(range: 'past' | 'future') {
  const cookieStore = await cookies()
  cookieStore.set('concertsRange', range, { maxAge: YEAR })
}

export async function saveLastQueryState(
  resource: 'concerts' | 'bands',
  queryStates: Record<string, string | number | number[] | boolean | null | undefined>
) {
  const cookieStore = await cookies()
  const searchParams = new URLSearchParams(
    // @ts-expect-error
    Object.fromEntries(
      Object.entries(queryStates)
        .filter(([, value]) => typeof value !== undefined && value !== null)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return [key, value.join(',')]
          } else if (typeof value === 'boolean') {
            return [key, value.toString()]
          }
          return [key, value]
        })
    )
  )
  cookieStore.set(`${resource}LastQueryState`, `?${searchParams.toString()}`)
}