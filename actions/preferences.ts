'use server'

import { cookies } from 'next/headers'

export async function setViewPreference(value: { concerts_view: string; user_view: string }) {
  const cookieStore = await cookies()
  cookieStore.set('view', `${value.concerts_view};${value.user_view}`, {
    maxAge: 60 * 60 * 24 * 365.25,
  })
}

export async function saveLastQueryState(
  ressource: 'concerts' | 'bands',
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
  cookieStore.set(`${ressource}LastQueryState`, `?${searchParams.toString()}`)
}

export async function setBandListHintPreference(bandListHint: 'hide' | 'show') {
  const cookieStore = await cookies()
  cookieStore.set('bandListHint', bandListHint, { maxAge: 60 * 60 * 24 * 365.25 })
}
