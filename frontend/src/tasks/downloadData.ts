import fs from "fs";
import path from "path";
import zlib from "zlib";
import { S3 } from "aws-sdk";
import { Language } from "../models/language";

const _download = async (filename: string): Promise<[string, boolean]> => {
  const bucket = "github-stats-files";
  const s3 = new S3();
  return new Promise<[string, boolean]>((resolve, reject) => {
    s3.getObject({ Bucket: bucket, Key: filename }, (err, resp) => {
      if (!err) {
        const data = zlib.gunzipSync(resp.Body as Buffer);
        resolve([data.toString(), true]);
        return;
      }
      if (err.code === "NoSuchKey") {
        resolve(["", false]);
        return;
      }
      reject(err);
    });
  });
};

type Data = {
  users: { date: string; count: number };
  orgs: { date: string; count: number };
  repos: { date: string; count: number };
  languages: { date: string; languages: Language[] };
};

(async () => {
  const rows: Data[] = [];

  const date = new Date();
  for (let i = 0; i < 365; i++) {
    const dateString = date.toISOString().split("T")[0];

    const [users, usersOk] = await _download(
      path.join(dateString, "users.json.gz")
    );
    if (!usersOk) break;
    const [orgs, orgsOk] = await _download(
      path.join(dateString, "orgs.json.gz")
    );
    const [repos, reposOk] = await _download(
      path.join(dateString, "repos.json.gz")
    );
    const [languages, languagesOk] = await _download(
      path.join(dateString, "languages.json.gz")
    );
    if (!orgsOk || !reposOk || !languagesOk) {
      throw new Error("fetch failed");
    }
    rows.push({
      users: JSON.parse(users),
      orgs: JSON.parse(orgs),
      repos: JSON.parse(repos),
      languages: JSON.parse(languages),
    });

    date.setUTCDate(date.getUTCDate() - 1);
  }

  fs.writeFileSync(
    path.join(process.cwd(), "src/data.json"),
    JSON.stringify(rows)
  );
})();
