import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const cloudflareStreamEndpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`
  const supabase = await createClient()

  const { data: memories, error } = await supabase.from('memories').select('file_id')

  if (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
  }

  const listVideosData = await fetch(cloudflareStreamEndpoint, {
    method: 'GET',
    headers: {
      Authorization: `bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
  }).then(res => res.json())

  listVideosData.result.forEach(async (item: any) => {
    if (memories.some(memory => memory.file_id === item.uid)) return

    const response = await fetch(`${cloudflareStreamEndpoint}/${item.uid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.error(`Failed to delete video ${item.uid}: ${response.statusText}`)
    }
  })

  return new NextResponse(null)
}
