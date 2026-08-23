import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
import { type NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  const libraryId = BUNNY_LIBRARY_ID
  const videoId = request.nextUrl.searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId parameter' }, { status: 400 })
  }

  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
    {
      method: 'DELETE',
      headers: {
        AccessKey: process.env.BUNNY_STREAM_API_KEY,
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
