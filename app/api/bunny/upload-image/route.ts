import { BUNNY_STORAGE_ZONE } from '@/lib/bunnyHelpers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const storageZone = BUNNY_STORAGE_ZONE
  const accessKey = process.env.BUNNY_STORAGE_API_KEY

  const host = 'storage.bunnycdn.com'
  const uploadUrl = `https://${host}/${storageZone}/${file.name}`

  const bunnyRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: accessKey,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: buffer,
  })

  if (!bunnyRes.ok) {
    const text = await bunnyRes.text()
    return NextResponse.json({ error: text }, { status: bunnyRes.status })
  }

  return NextResponse.json({
    filename: file.name,
    url: `https://${storageZone}.b-cdn.net/${file.name}`,
  })
}
