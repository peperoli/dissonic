'use server'

import Cloudflare from 'cloudflare'

export async function getImageUploadUrl() {
  const cloudflare = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })

  const { id: imageId, uploadURL } = await cloudflare.images.v2.directUploads.create({
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  })
  if (!imageId || !uploadURL) {
    throw new Error('Failed to get upload URL from Cloudflare')
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch image upload URL: ${res.status} ${res.statusText}`)
  }

  return { imageId, uploadURL }
}

export async function getVideoUploadUrl() {
  const cloudflare = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })
  const { uid:videoId, uploadURL } = await cloudflare.stream.directUpload.create({
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
    maxDurationSeconds: 60,
  })

  if (!videoId || !uploadURL) {
    throw new Error('Failed to get upload URL from Cloudflare')
  }

  return { videoId, uploadURL }
}

export async function deleteImageCloudflare(imageId: string) {
  const cloudflare = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })

  return await cloudflare.images.v1.delete(imageId, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  })
}

export async function deleteVideoCloudflare(videoId: string) {
  const cloudflare = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })

  return await cloudflare.stream.delete(videoId, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  })
}
