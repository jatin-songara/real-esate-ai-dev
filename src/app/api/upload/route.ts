import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || ''
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || ''
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || ''
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''

    // 1. Initialize S3 client for Cloudflare R2
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileKey = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

    // 2. Upload file to R2 bucket
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      })
    )

    // 3. Return public URL
    const fileUrl = `${publicUrl}/${fileKey}`
    return NextResponse.json({ success: true, url: fileUrl })
  } catch (err: any) {
    console.error('Cloudflare R2 upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
