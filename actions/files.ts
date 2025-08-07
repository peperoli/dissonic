'use server'

import { createClient } from '@/utils/supabase/server'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import Cloudflare from 'cloudflare'

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

export async function getPutObjectUrl(fileName: string) {
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
    const signedUrl = await getSignedUrl(S3, putObjectCommand, {
      expiresIn: 60,
    })

    return { signedUrl }
  } catch (error) {
    throw error
  }
}

export async function getImageUploadUrl() {
  const cloudflare = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
  })

  const { id, uploadURL } = await cloudflare.images.v2.directUploads.create({
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  })
  if (!uploadURL) {
    throw new Error('Failed to get upload URL from Cloudflare')
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    }
  )
  
  if (!res.ok) {
    throw new Error(`Failed to fetch image upload URL: ${res.status} ${res.statusText}`)
  }

  return { id, uploadURL }
}

export async function getCreateMultipartUploadUrl(bucketName: string, fileName: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const createMultipartUploadCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
    })

    const { UploadId } = await S3.send(createMultipartUploadCommand)

    if (!UploadId) {
      throw new Error('Failed to create multipart upload')
    }

    return { uploadId: UploadId }
  } catch (error) {
    throw error
  }
}

export async function getUploadPartUrls(
  bucketName: string,
  fileName: string,
  uploadId: string,
  partsCount: number
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const uploadPartUrls = await Promise.all(
      Array.from({ length: partsCount }, async (_, index) => {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: 'concert-memories',
          Key: fileName,
          UploadId: uploadId,
          PartNumber: index + 1,
        })
        return getSignedUrl(S3, uploadPartCommand, {
          expiresIn: 3600,
        })
      })
    )

    return { uploadPartUrls }
  } catch (error) {
    throw error
  }
}

export async function completeMultipartUpload(
  bucketName: string,
  fileName: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    })

    return await S3.send(completeMultipartUploadCommand)
  } catch (error) {
    await abortMultipartUpload(bucketName, fileName, uploadId)
    throw error
  }
}

export async function abortMultipartUpload(bucketName: string, fileName: string, uploadId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const abortMultipartUploadCommand = new AbortMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
    })

    return await S3.send(abortMultipartUploadCommand)
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
