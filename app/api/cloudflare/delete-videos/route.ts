import { NextResponse } from 'next/server'

export async function GET() {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
  })

  const data = await response.json()
  data.result.forEach(async (item: any) => {
    const response = await fetch(`${endpoint}/${item.uid}`, {
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
