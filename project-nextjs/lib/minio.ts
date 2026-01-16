import * as Minio from 'minio'

const endpointUrl = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const url = new URL(endpointUrl);

const minioClient = new Minio.Client({
    endPoint: url.hostname,
    port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
    useSSL: url.protocol === 'https:',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    region: process.env.MINIO_REGION || 'us-east-1',
})

const bucketName = process.env.MINIO_BUCKET || 'newsviewbd'

/**
 * Upload an image to MinIO
 */
export async function uploadImage(
    file: Buffer,
    fileName: string,
    contentType: string = 'image/jpeg'
): Promise<string> {
    try {
        // Ensure bucket exists
        // Ensure bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName)
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1')
        }

        // Always ensure bucket policy is public-read
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        }
        await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))

        // Upload file
        const objectName = `${Date.now()}-${fileName}`
        await minioClient.putObject(bucketName, objectName, file, file.length, {
            'Content-Type': contentType,
        })

        // Return public URL
        return getImageUrl(objectName)
    } catch (error) {
        console.error('MinIO upload error:', error)
        throw new Error('Failed to upload image')
    }
}

/**
 * Get public URL for an image
 */
/**
 * Get public URL for an image
 */
export function getImageUrl(objectName: string): string {
    const endpoint = process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    // Remove trailing slash from endpoint if present
    const cleanEndpoint = endpoint.replace(/\/$/, '');
    return `${cleanEndpoint}/${bucketName}/${objectName}`;
}

/**
 * Delete an image from MinIO
 */
export async function deleteImage(objectName: string): Promise<void> {
    try {
        await minioClient.removeObject(bucketName, objectName)
    } catch (error) {
        console.error('MinIO delete error:', error)
        throw new Error('Failed to delete image')
    }
}

/**
 * List images from MinIO (for gallery)
 */
export async function listImages(prefix?: string): Promise<string[]> {
    try {
        const stream = minioClient.listObjects(bucketName, prefix, true)
        const objects: string[] = []

        return new Promise((resolve, reject) => {
            stream.on('data', (obj) => {
                if (obj.name) {
                    objects.push(obj.name)
                }
            })
            stream.on('end', () => resolve(objects))
            stream.on('error', reject)
        })
    } catch (error) {
        console.error('MinIO list error:', error)
        throw new Error('Failed to list images')
    }
}

export { minioClient }
