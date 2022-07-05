import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fetchOrganizationCount, fetchRepositoryCount, fetchUserCount } from "../lib/github";

const dataDir = path.join(process.cwd(), "data");

// const _loadData = (filename: string): string => {
//   return fs.readFileSync(path.join(dataDir, filename), "utf8");
// };

const _writeData = (filename: string, data: string): void => {
  fs.writeFileSync(path.join(dataDir, filename), data);
  fs.writeFileSync(path.join(dataDir, `${filename}.gz`), _gzip(data));
};

const _gzip = (data: string): Buffer => {
  return zlib.gzipSync(data);
};

const _sleep = async (miliseconds: number): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, miliseconds));

const _fetchCountWithRetry = async (retryCount: number, fn: () => Promise<number>) => {
  const counts: number[] = [];
  for (let i = 0; i < retryCount; i++) {
    counts.push(await fn());
    await _sleep(2000);
  }
  return Math.max(...counts);
}

const _fetchUserCountWithRetry = async (
  retryCount: number,
): Promise<number> => {
  return _fetchCountWithRetry(retryCount, fetchUserCount);
};

const _fetchOrganizationCountWithRetry = async (retryCount: number): Promise<number> => {
  return _fetchCountWithRetry(retryCount, fetchOrganizationCount);
}

const _fetchRepositoryCountWithRetry = async (retryCount: number): Promise<number> => {
  return _fetchCountWithRetry(retryCount, fetchRepositoryCount);
}

// FIXME: 急ぎで書いたので汚すぎる
(async () => {
  const userCount = await _fetchUserCountWithRetry(5);
  const usersData = JSON.stringify({ date: new Date().toISOString(), count: userCount });
  _writeData("users.json", usersData);

  const orgCount = await _fetchOrganizationCountWithRetry(5);
  const orgsData = JSON.stringify({ date: new Date().toISOString(), count: orgCount });
  _writeData("orgs.json", orgsData);

  const repoCount = await _fetchRepositoryCountWithRetry(10);
  const reposData = JSON.stringify({ date: new Date().toISOString(), count: repoCount });
  _writeData("repos.json", reposData);

  // const numOrgs = Math.max(
  //   await fetchOrganizationCount(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchOrganizationCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchOrganizationCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchOrganizationCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchOrganizationCount();
  //   })(),
  // );
  // _writeData(
  //   "orgs.json",
  //   JSON.stringify({ date: new Date().toISOString(), count: numOrgs }),
  // );

  // const numRepos = Math.max(
  //   await fetchRepositoryCount(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchRepositoryCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchRepositoryCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchRepositoryCount();
  //   })(),
  //   await (async () => {
  //     await _sleep(2000);
  //     return fetchRepositoryCount();
  //   })(),
  // );
  // _writeData(
  //   "repos.json",
  //   JSON.stringify({ date: new Date().toISOString(), count: numRepos }),
  // );

  // const languageWithoutCounts = JSON.parse(_loadData("languages.json"));
  // const languages = await fetchLanguageCounts(languageWithoutCounts);
  // for (let i = 0; i < 5; i++) {
  //   await _sleep(2000);
  //   const nextLanguages = await fetchLanguageCounts(languageWithoutCounts);
  //   for (const nextLanguage of nextLanguages) {
  //     const prevLanguageIndex = languages.findIndex(
  //       language => language.name === nextLanguage.name,
  //     );
  //     if (prevLanguageIndex === -1)
  //       throw new Error(`language not found: ${nextLanguage.name}`);
  //     if (languages[prevLanguageIndex].count < nextLanguage.count) {
  //       languages[prevLanguageIndex] = nextLanguage;
  //     }
  //   }
  // }

  // _writeData(
  //   "languages.json",
  //   JSON.stringify({ date: new Date().toISOString(), languages }),
  // );
})();
