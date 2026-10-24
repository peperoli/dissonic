import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const profiles: { avatar_path: string | null }[] = []
  const pageSize = 1000

  for (let offset = 0; ; offset += pageSize) {
    const { data: page, error: profilesError } = await supabase
      .from('profiles')
      .select('avatar_path')
      .order('id')
      .range(offset, offset + pageSize - 1)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    profiles.push(...page)
    if (page.length < pageSize) break
  }

  const data: { name: string }[] = []
  const storagePageSize = 100

  for (let offset = 0; ; offset += storagePageSize) {
    const { data: page, error } = await supabase.storage.from('avatars').list('', {
      limit: storagePageSize,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })

    if (error) {
      console.error('Error listing avatar files:', error)
      return NextResponse.json({ error: 'Failed to list avatar files' }, { status: 500 })
    }

    data.push(...page)
    if (page.length < storagePageSize) break
  }

  const unusedAvatars = data.filter(
    file => !profiles.some(profile => profile.avatar_path === file.name)
  )

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
