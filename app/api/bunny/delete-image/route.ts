import { BUNNY_STORAGE_ZONE } from '@/lib/bunnyHelpers'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName')

  if (!fileName) {
    return NextResponse.json({ error: 'No fileName provided' }, { status: 400 })
  }

  const storageZone = BUNNY_STORAGE_ZONE
  const accessKey = process.env.BUNNY_STORAGE_API_KEY

  const stem = fileName.split('.').slice(0, -1).join('.')
  const extension = fileName.split('.').at(-1)
  const fileNames = [
    `${stem}.${extension}`,
    `${stem}-thumbnail.${extension}`,
    `${stem}-mobile.${extension}`,
  ]

  const responses = await Promise.all(
    fileNames.map(async fileName => {
      return await fetch(`https://storage.bunnycdn.com/${storageZone}/${fileName}`, {
        method: 'DELETE',
        headers: { AccessKey: accessKey },
      })
    })
  )

  if (responses.some(res => !res.ok)) {
    const res = responses.find(res => !res.ok)
    const text = await res?.text()
    return NextResponse.json({ error: text }, { status: res?.status })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
