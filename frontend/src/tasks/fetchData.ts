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

const _sleep = async (miliseconds: number): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, miliseconds));

const _fetchCountWithRetry = async (
  retryCount: number,
  intervalMiliseconds: number,
  fn: () => Promise<number>,
) => {
  const counts: number[] = [];
  for (let i = 0; i < retryCount; i++) {
    counts.push(await fn());
    await _sleep(intervalMiliseconds);
  }
  return Math.max(...counts);
};

const _fetchUserCountWithRetry = async (
  retryCount: number,
  intervalMiliseconds: number,
): Promise<number> => {
  return _fetchCountWithRetry(retryCount, intervalMiliseconds, fetchUserCount);
};

const _fetchOrganizationCountWithRetry = async (
  retryCount: number,
  intervalMiliseconds: number,
): Promise<number> => {
  return _fetchCountWithRetry(
    retryCount,
    intervalMiliseconds,
    fetchOrganizationCount,
  );
};

const _fetchRepositoryCountWithRetry = async (
  retryCount: number,
  intervalMiliseconds: number,
): Promise<number> => {
  return _fetchCountWithRetry(
    retryCount,
    intervalMiliseconds,
    fetchRepositoryCount,
  );
};

// FIXME: 急ぎで書いたので汚すぎる
(async () => {
  const userCount = await _fetchUserCountWithRetry(5, 3000);
  const usersData = JSON.stringify({
    date: new Date().toISOString(),
    count: userCount,
  });
  _writeData("users.json", usersData);

  const orgCount = await _fetchOrganizationCountWithRetry(5, 3000);
  const orgsData = JSON.stringify({
    date: new Date().toISOString(),
    count: orgCount,
  });
  _writeData("orgs.json", orgsData);

  const repoCount = await _fetchRepositoryCountWithRetry(10, 5000);
  const reposData = JSON.stringify({
    date: new Date().toISOString(),
    count: repoCount,
  });
  _writeData("repos.json", reposData);

  const languageWithoutCounts = JSON.parse(
    _loadData("languages_without_count.json"),
  );
  const languages = await fetchLanguageCounts(languageWithoutCounts);
  for (let i = 0; i < 5; i++) {
    await _sleep(5000);
    const nextLanguages = await fetchLanguageCounts(languageWithoutCounts);
    for (const nextLanguage of nextLanguages) {
      const prevLanguageIndex = languages.findIndex(
        language => language.name === nextLanguage.name,
      );
      if (prevLanguageIndex === -1)
        throw new Error(`language not found: ${nextLanguage.name}`);
      if (languages[prevLanguageIndex].count < nextLanguage.count) {
        languages[prevLanguageIndex] = nextLanguage;
      }
    }
  }

  const languagesData = JSON.stringify({
    date: new Date().toISOString(),
    languages,
  });
  _writeData("languages.json", languagesData);
})();
