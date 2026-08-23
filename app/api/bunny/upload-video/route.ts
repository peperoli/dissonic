import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
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
  const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY

  if (!BUNNY_API_KEY || !BUNNY_LIBRARY_ID) {
    return NextResponse.json({ error: 'Bunny Stream not configured' }, { status: 500 })
  }

  const { title } = (await request.json()) as { title?: string }

  // Step 1: Create a video object in Bunny Stream
  const createResponse = await fetch(
    `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessKey: BUNNY_API_KEY,
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
    .update(`${BUNNY_LIBRARY_ID}${BUNNY_API_KEY}${expirationTime}${video.guid}`)
    .digest('hex')

  return NextResponse.json({
    videoId: video.guid,
    libraryId: BUNNY_LIBRARY_ID,
    expirationTime,
    signature,
    embedUrl: `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${video.guid}`,
  } satisfies UploadCredentials)
}
