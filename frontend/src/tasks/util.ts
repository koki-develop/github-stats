import fs from "fs";
import path from "path";
import zlib from "zlib";
import { S3 } from "aws-sdk";

const BUCKET_NAME = "github-stats-files";
const DATA_DIR = path.join(process.cwd(), "data");

export const FileNames = {
  LanguagesWithoutCount: "languages_without_count.json",
} as const;

export const gzip = (data: string): Buffer => {
  return zlib.gzipSync(data);
};

export const gunzip = (data: Buffer): string => {
  return zlib.gunzipSync(data).toString();
}

export const uploadData = async (filename: string, data: string): Promise<void> => {
  const s3 = new S3();

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: gzip(data),
    ContentType: "application/gzip",
  }).promise()
}

export const downloadData = async (filename: string): Promise<string> => {
  const s3 = new S3()

  const resp = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
  return gunzip(resp.Body as Buffer);
}

export const writeData = (filename: string, data: string): void => {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, data)
  fs.writeFileSync(`${filepath}.gz`, gzip(data))
}

export const readData = (filename: string): string => {
  const filepath = path.join(DATA_DIR, filename);
  return fs.readFileSync(filepath, "utf8");
}
