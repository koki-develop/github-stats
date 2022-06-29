import fs from "fs";
import path from "path";
import zlib from "zlib";
import {
  fetchLanguageCounts,
  fetchOrganizationCount,
  fetchRepositoryCount,
  fetchUserCount,
} from "../lib/github";

const dataDir = path.join(process.cwd(), "data");

const _loadData = (filename: string): string => {
  return fs.readFileSync(path.join(dataDir, filename), "utf8");
};

const _writeData = (filename: string, data: string): void => {
  fs.writeFileSync(path.join(dataDir, filename), data);
  fs.writeFileSync(path.join(dataDir, `${filename}.gz`), _gzip(data));
};

const _gzip = (data: string): Buffer => {
  return zlib.gzipSync(data);
};

(async () => {
  // 数値が安定しないので複数回叩いて最大値を取る
  const numUsers = Math.max(
    await fetchUserCount(),
    await fetchUserCount(),
    await fetchUserCount(),
    await fetchUserCount()
  );
  _writeData(
    "users.json",
    JSON.stringify({ date: new Date().toISOString(), count: numUsers })
  );

  const numOrgs = Math.max(
    await fetchOrganizationCount(),
    await fetchOrganizationCount(),
    await fetchOrganizationCount(),
    await fetchOrganizationCount()
  );
  _writeData(
    "orgs.json",
    JSON.stringify({ date: new Date().toISOString(), count: numOrgs })
  );

  const numRepos = Math.max(
    await fetchRepositoryCount(),
    await fetchRepositoryCount(),
    await fetchRepositoryCount(),
    await fetchRepositoryCount()
  );
  _writeData(
    "repos.json",
    JSON.stringify({ date: new Date().toISOString(), count: numRepos })
  );

  const languageWithoutCounts = JSON.parse(_loadData("languages.json"));
  const languages = await fetchLanguageCounts(languageWithoutCounts);
  _writeData(
    "languages.json",
    JSON.stringify({ date: new Date().toISOString(), languages })
  );
})();
