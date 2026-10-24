import { Tables } from '@/types/supabase'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { FileObject } from '@supabase/storage-js'
import { Temporal } from 'temporal-polyfill'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const profiles: Pick<Tables<'profiles'>, 'avatar_path'>[] = []
  const PAGE_SIZE = 1000

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data: page, error: profilesError } = await supabase
      .from('profiles')
      .select('avatar_path')
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    profiles.push(...page)
    if (page.length < PAGE_SIZE) break
  }

  const data: FileObject[] = []
  const STORAGE_PAGE_SIZE = 100

  for (let offset = 0; ; offset += STORAGE_PAGE_SIZE) {
    const { data: page, error } = await supabase.storage.from('avatars').list('', {
      limit: STORAGE_PAGE_SIZE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      console.error('Error listing avatar files:', error)
      return NextResponse.json({ error: 'Failed to list avatar files' }, { status: 500 })
    }

    data.push(...page)
    if (page.length < STORAGE_PAGE_SIZE) break
  }

  const unusedAvatars = data
    .filter(file => !profiles.some(profile => profile.avatar_path === file.name))
    .filter(file => {
      if (!file.created_at) return false

      return (
        Temporal.Instant.compare(
          Temporal.Instant.from(file.created_at),
          Temporal.Now.instant().subtract({ minutes: 1 })
        ) < 0
      )
    })

  await Promise.all(
    unusedAvatars.map(async file => {
      const { error: deleteError } = await supabase.storage.from('avatars').remove([file.name])
      if (deleteError) {
        console.error('Error deleting avatar file:', deleteError)
        throw deleteError
      }
    })
  )

  return NextResponse.json(
    { ok: true, message: `${unusedAvatars.length} avatars deleted` },
    { status: 200 }
  )
}
