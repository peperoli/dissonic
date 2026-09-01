import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
import { createClient } from '@/utils/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const apiKey = process.env.BUNNY_STREAM_API_KEY
  const libraryId = BUNNY_LIBRARY_ID
  const videoId = request.nextUrl.searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId parameter' }, { status: 400 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !apiKey) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: videoUpload } = await supabase
    .from('video_uploads')
    .select('id')
    .eq('video_id', videoId)
    .eq('user_id', user?.id)
    .single()

  if (!videoUpload) {
    return NextResponse.json({ error: 'Video not found or not owned by user' }, { status: 404 })
  }

  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
    {
      method: 'DELETE',
      headers: {
        AccessKey: apiKey,
      },
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error('Failed to delete Bunny video:', error)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
