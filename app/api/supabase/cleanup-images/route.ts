import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('avatar_path')

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
  }

  const { data, error } = await supabase.storage.from('avatars').list('')

  if (error) {
    console.error('Error listing avatar files:', error)
    return NextResponse.json({ error: 'Failed to list avatar files' }, { status: 500 })
  }

  const unusedAvatars = data.filter(
    file => !profiles.some(profile => profile.avatar_path === file.name)
  )

  await Promise.all(
    unusedAvatars.map(async file => {
      const { error: deleteError } = await supabase.storage.from('avatars').remove([file.name])
      if (deleteError) {
        console.error('Error deleting avatar file:', deleteError)
      }
    })
  )

  return NextResponse.json(
    { ok: true, message: `${unusedAvatars.length} avatars deleted` },
    { status: 200 }
  )
}
