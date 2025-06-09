'use server'

import { createClient } from '@/utils/supabase/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

export async function getPutUrl(fileName: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: 'concert-memories',
      Key: fileName,
    })
    // @ts-expect-error
    const signedUrl = await getSignedUrl(S3, putObjectCommand, {
      expiresIn: 60,
    })

    return { fileName, signedUrl }
  } catch (error) {
    throw error
  }
}

export async function deleteFile(fileName: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: 'concert-memories',
      Key: fileName,
    })

    await S3.send(deleteObjectCommand)
  } catch (error) {
    throw error
  }
}
