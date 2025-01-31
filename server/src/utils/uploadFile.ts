import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export async function uploadFile(file: Express.Multer.File) {
    try {
        const key = file.originalname + "-" + Date.now();

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        const data = await s3Client.send(command, { requestTimeout: 5000 });

        if (data.$metadata.httpStatusCode !== 200) {
            throw new Error("Error uploading file");
        }

        return {
            URL: `https://${process.env.AWS_BUCKET_NAME!}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`,
        };

    } catch (error) {
        throw new Error(`Error Uploading file: ${error}`);
    }
}


export async function deleteFile(key: string) {
    try {
        const result = await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: key
        }));

        return result;

    } catch (err) {
        throw new Error(`Error deleting file: ${err}`);
    }
}