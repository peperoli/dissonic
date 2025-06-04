'use server'

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

export async function uploadMemories(files: File[]) {
  const urls: string[] = []
  try {
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const putObjectCommand = new PutObjectCommand({
        Bucket: 'concert-memories',
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
      await S3.send(putObjectCommand)
      urls.push(`https://pub-8067124940ec421cb1be4c6467795917.r2.dev/${fileName}`)
    }
    return urls
  } catch (error) {
    throw error
  }
}

export async function deleteMemories(fileNames: string[]) {
  try {
    for (const fileName of fileNames) {
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: 'concert-memories',
        Key: fileName,
      })
      await S3.send(deleteObjectCommand)
    }
  } catch (error) {
    throw error
  }
}
