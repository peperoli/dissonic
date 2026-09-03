import { BUNNY_STORAGE_ZONE } from '@/lib/bunnyHelpers'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const storageZone = BUNNY_STORAGE_ZONE
  const storageEndpoint = `https://storage.bunnycdn.com/${storageZone}/`
  const supabase = await createClient()
  const apiKey = process.env.BUNNY_STORAGE_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Bunny Storage not configured' }, { status: 500 })
  }

  const { data: memories, error } = await supabase.from('memories').select('file_id')

  if (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }

  const listImagesData: { ObjectName: string }[] = await fetch(storageEndpoint, {
    method: 'GET',
    headers: {
      AccessKey: apiKey,
    },
  }).then(res => res.json())

  if (!listImagesData || !Array.isArray(listImagesData)) {
    console.error('Unexpected list response:', listImagesData)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 502 })
  }

  const unusedImages = listImagesData.filter(
    item =>
      !memories.some(
        memory =>
          memory.file_id === item.ObjectName ||
          memory.file_id === item.ObjectName.replace(/-thumbnail|-mobile/, '')
      )
  )

  console.log(
    'List of images from Bunny Storage:',
    listImagesData.map(item => item.ObjectName)
  )
  console.log(
    'Unused images to delete:',
    unusedImages.map(item => item.ObjectName)
  )

  await Promise.all(
    unusedImages.map(async item => {
      const response = await fetch(`${storageEndpoint}${item.ObjectName}`, {
        method: 'DELETE',
        headers: {
          AccessKey: apiKey,
        },
      })

      if (!response.ok) {
        console.error(`Failed to delete image ${item.ObjectName}: ${response.statusText}`)
      }
    })
  )

  return NextResponse.json(
    { ok: true, message: `${unusedImages.length} images deleted` },
    { status: 200 }
  )
}
