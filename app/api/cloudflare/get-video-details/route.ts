import { type NextRequest, NextResponse } from 'next/server'
import Cloudflare from 'cloudflare'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')

  if (!videoId) {
    return new NextResponse('Missing videoId', { status: 400 })
  }

  const client = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })

  const video = await client.stream.get(videoId, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  })

  return NextResponse.json(video)
}
