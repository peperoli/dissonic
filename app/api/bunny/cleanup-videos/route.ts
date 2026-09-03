import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const libraryId = BUNNY_LIBRARY_ID
  const bunnyStreamEndpoint = `https://video.bunnycdn.com/library/${libraryId}/videos`
  const supabase = await createClient()
  const apiKey = process.env.BUNNY_STREAM_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Bunny Stream not configured' }, { status: 500 })
  }

  const { data: memories, error } = await supabase.from('memories').select('file_id')

  if (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }

  const listVideosData = await fetch(bunnyStreamEndpoint, {
    method: 'GET',
    headers: {
      AccessKey: apiKey,
    },
  }).then(res => res.json())

  if (!listVideosData || !Array.isArray(listVideosData.items)) {
    console.error('Unexpected list response:', listVideosData)
    return NextResponse.json({ error: 'Failed to list videos' }, { status: 502 })
  }

  await Promise.all(
    listVideosData.items.map(async (item: { guid: string }) => {
      if (memories.some(memory => memory.file_id === item.guid)) return

      const response = await fetch(`${bunnyStreamEndpoint}/${item.guid}`, {
        method: 'DELETE',
        headers: {
          AccessKey: apiKey,
        },
      })

      if (!response.ok) {
        console.error(`Failed to delete video ${item.guid}: ${response.statusText}`)
      }
    })
  )

  return new NextResponse(null)
}
