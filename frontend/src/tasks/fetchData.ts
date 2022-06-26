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
  const numUsers = await fetchUserCount();
  _writeData("users.json", JSON.stringify({ count: numUsers }));

  const numOrgs = await fetchOrganizationCount();
  _writeData("orgs.json", JSON.stringify({ count: numOrgs }));

  const numRepos = await fetchRepositoryCount();
  _writeData("repos.json", JSON.stringify({ count: numRepos }));

  const languageWithoutCounts = JSON.parse(_loadData("languages.json"));
  const languages = await fetchLanguageCounts(languageWithoutCounts);
  _writeData("languages.json", JSON.stringify(languages));
})();
