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
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: file.filename,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        const data = await s3Client.send(command, { requestTimeout: 5000 });

        if (data.$metadata.httpStatusCode === 200) {
            return {
                URL: `https://${process.env.AWS_BUCKET_NAME!}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${name}`
            };
        }

        throw new Error("Error uploading file");

    } catch (error) {
        console.error(`Error uploading file: ${error}`);
    }
}

export async function deleteFile(key: string) {
    try {
        if (!key) {
            throw new Error("Key is required");
        }

        const result = await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: key
        }));
        console.log(result);

        return result;
    } catch (err) {
        console.error(`Error deleting file: ${err}`);
        throw err;
    }
}