import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { Database } from '@/types/supabase'
import { getBunnyVideoDetails } from '@/lib/bunnyHelpers'

function validateWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  signatureVersion: string | null,
  signatureAlgorithm: string | null,
  signatureSecret: string
) {
  if (signatureVersion !== 'v1') {
    return false
  }

  if (signatureAlgorithm !== 'hmac-sha256') {
    return false
  }

  const expectedHex = createHmac('sha256', signatureSecret).update(rawBody, 'utf8').digest('hex')

  if (
    typeof signatureHeader !== 'string' ||
    signatureHeader.length !== expectedHex.length ||
    !/^[0-9a-f]+$/i.test(signatureHeader)
  ) {
    return false
  }

  return timingSafeEqual(Buffer.from(expectedHex, 'utf8'), Buffer.from(signatureHeader, 'utf8'))
}

type CallbackData = {
  VideoLibraryId: number
  VideoGuid: string
  Status: number
}

type VideoStatus = Database['public']['Enums']['video_status']

export async function POST(request: NextRequest) {
  const signatureSecret = process.env.BUNNY_STREAM_READ_API_KEY

  if (!signatureSecret) {
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-bunnystream-signature')
  const version = request.headers.get('x-bunnystream-signature-version')
  const algorithm = request.headers.get('x-bunnystream-signature-algorithm')
  const supabase = createAdminClient()

  if (!validateWebhookSignature(rawBody, signature, version, algorithm, signatureSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const data = JSON.parse(rawBody) as CallbackData
  console.log('Received Bunny.net webhook:', data)
  const statusMap: Record<number, VideoStatus> = {
    0: 'queued',
    1: 'processing',
    2: 'encoding',
    3: 'finished',
    4: 'resolution_finished',
    5: 'failed',
  }
  const status = statusMap[data.Status]

  if (!status) {
    console.log('Unknown status received from Bunny.net webhook:', data.Status)
    return NextResponse.json({ ok: true, reason: 'unknown_status' }, { status: 202 })
  }

  const { data: updatedMemories, error } = await supabase
    .from('memories')
    .update({ status })
    .eq('file_id', data.VideoGuid)
    .select('id')

  if (error) {
    console.error('Failed to update memory status:', error)
    return NextResponse.json({ error: 'Failed to update memory status' }, { status: 500 })
  }

  if (!updatedMemories || updatedMemories.length === 0) {
    console.warn('No memory row matched webhook video guid:', data.VideoGuid)
    return NextResponse.json({ ok: true, reason: 'no_memory_found' }, { status: 202 })
  }

  if (status === 'finished') {
    const { length, width, height, thumbnailUrl } = await getBunnyVideoDetails(data.VideoGuid)

    const { error } = await supabase
      .from('memories')
      .update({ duration: length, width, height, thumbnail_url: thumbnailUrl })
      .eq('file_id', data.VideoGuid)
      .select('id')

    if (error) {
      console.error('Failed to update memory thumbnail URL:', error)
      return NextResponse.json({ error: 'Failed to update memory thumbnail URL' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, data })
}
