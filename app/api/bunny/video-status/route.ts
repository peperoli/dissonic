import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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

export async function POST(request: NextRequest) {
  const signatureSecret = process.env.BUNNY_STREAM_READ_API_KEY

  if (!signatureSecret) {
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-bunnystream-signature')
  const version = request.headers.get('x-bunnystream-signature-version')
  const algorithm = request.headers.get('x-bunnystream-signature-algorithm')
  const supabase = await createClient()

  if (!validateWebhookSignature(rawBody, signature, version, algorithm, signatureSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const data = JSON.parse(rawBody) as CallbackData
  console.log('Received Bunny.net webhook:', data)

  if (data.Status === 1) {
    const { error } = await supabase
      .from('memories')
      .update({ status: 'processing' })
      .eq('file_id', data.VideoGuid)

    if (error) {
      console.error('Failed to update memory status:', error)
    }
  }

  if (data.Status === 3) {
    const { error } = await supabase
      .from('memories')
      .update({ status: 'finished' })
      .eq('file_id', data.VideoGuid)

    if (error) {
      console.error('Failed to update memory status:', error)
    }
  }

  if (data.Status === 5) {
    const { error } = await supabase
      .from('memories')
      .update({ status: 'failed' })
      .eq('file_id', data.VideoGuid)

    if (error) {
      console.error('Failed to update memory status:', error)
    }
  }

  return NextResponse.json({ ok: true, data })
}
