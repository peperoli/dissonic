import { BUNNY_LIBRARY_ID } from '@/lib/bunnyHelpers'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const libraryId = BUNNY_LIBRARY_ID
  const bunnyStreamEndpoint = `https://video.bunnycdn.com/library/${libraryId}/videos`
  const supabase = await createClient()

  const { data: memories, error } = await supabase.from('memories').select('file_id')

  if (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }

  const listVideosData = await fetch(bunnyStreamEndpoint, {
    method: 'GET',
    headers: {
      AccessKey: process.env.BUNNY_STREAM_API_KEY,
    },
  }).then(res => res.json())
  console.log('Fetched videos from Bunny Stream:', listVideosData)

  await Promise.all(
    listVideosData.items.map(async (item: { guid: string }) => {
      if (memories.some(memory => memory.file_id === item.guid)) return

      const response = await fetch(`${bunnyStreamEndpoint}/${item.guid}`, {
        method: 'DELETE',
        headers: {
          AccessKey: process.env.BUNNY_STREAM_API_KEY,
        },
      })

      if (!response.ok) {
        console.error(`Failed to delete video ${item.guid}: ${response.statusText}`)
      }
    })
  )

  return new NextResponse(null)
}
