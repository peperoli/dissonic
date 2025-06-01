'use server'

import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'

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

export async function getMemories(fileNames: string[]) {
  const files = []
  try {
    for (const fileName of fileNames) {
      const command = new GetObjectCommand({
        Bucket: 'concert-memories',
        Key: fileName,
      })
      const file = await S3.send(command)
      files.push(await file.Body?.transformToWebStream())
    }
    return files
  } catch (error) {
    console.error('Error getting objects:', error)
  }
}

export async function uploadMemories(files: File[]) {
  const fileNames: string[] = []
  try {
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const command = new PutObjectCommand({
        Bucket: 'concert-memories',
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
      await S3.send(command)
      fileNames.push(fileName)
    }
    return fileNames
  } catch (error) {
    console.error('Error uploading files:', error)
  }
}
