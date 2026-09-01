import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
import { createClient } from '@/utils/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'

interface CreateVideoResponse {
  guid: string
  title: string
  libraryId: number
}

interface UploadCredentials {
  videoId: string
  libraryId: string
  expirationTime: number
  signature: string
  embedUrl: string
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const apiKey = process.env.BUNNY_STREAM_API_KEY
  const libraryId = BUNNY_LIBRARY_ID

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !apiKey) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { title } = (await request.json()) as { title?: string }

  // Step 1: Create a video object in Bunny Stream
  const createResponse = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessKey: apiKey,
      },
      body: JSON.stringify({
        title: title ?? 'Untitled Video',
      }),
    }
  )

  if (!createResponse.ok) {
    const error = await createResponse.text()
    console.error('Failed to create Bunny video:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }

  const video = (await createResponse.json()) as CreateVideoResponse

  // Step 2: Generate TUS upload credentials
  const expirationTime = Math.floor(Date.now() / 1000) + 86400 // 24 hours

  const signature = createHash('sha256')
    .update(`${libraryId}${apiKey}${expirationTime}${video.guid}`)
    .digest('hex')

  return NextResponse.json({
    videoId: video.guid,
    libraryId: libraryId,
    expirationTime,
    signature,
    embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${video.guid}`,
  } satisfies UploadCredentials)
}
