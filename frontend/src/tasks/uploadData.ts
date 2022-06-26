import fs from "fs";
import path from "path";
import { S3 } from "aws-sdk";

const dataDir = path.join(process.cwd(), "data");

const _loadData = (filename: string): Buffer => {
  return fs.readFileSync(path.join(dataDir, filename));
};

(async () => {
  const today = new Date().toISOString().split("T")[0];
  const bucket = "github-stats-files";
  const s3 = new S3();

  const filenames = [
    "users.json.gz",
    "orgs.json.gz",
    "repos.json.gz",
    "languages.json.gz",
  ];
  for (const filename of filenames) {
    const data = _loadData(filename);
    await s3
      .putObject({
        Bucket: bucket,
        Key: path.join(today, filename),
        Body: data,
        ContentType: "application/gzip",
      })
      .promise();
  }
})();
