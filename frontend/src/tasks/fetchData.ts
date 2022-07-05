import fs from "fs";
import path from "path";
import zlib from "zlib";
import {
  fetchLanguageCounts,
  fetchOrganizationCount,
  fetchRepositoryCount,
  fetchUserCount,
} from "../lib/github";
import { Language } from "../models/language";

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

const _sleep = async (milliseconds: number) =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

// FIXME: 急ぎで書いたので汚すぎる
(async () => {
  // 数値が安定しないので複数回叩いて最大値を取る
  const numUsers = Math.max(
    await fetchUserCount(),
    await (async () => {
      await _sleep(2000);
      return fetchUserCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchUserCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchUserCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchUserCount();
    })(),
  );
  _writeData(
    "users.json",
    JSON.stringify({ date: new Date().toISOString(), count: numUsers }),
  );

  const numOrgs = Math.max(
    await fetchOrganizationCount(),
    await (async () => {
      await _sleep(2000);
      return fetchOrganizationCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchOrganizationCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchOrganizationCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchOrganizationCount();
    })(),
  );
  _writeData(
    "orgs.json",
    JSON.stringify({ date: new Date().toISOString(), count: numOrgs }),
  );

  const numRepos = Math.max(
    await fetchRepositoryCount(),
    await (async () => {
      await _sleep(2000);
      return fetchRepositoryCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchRepositoryCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchRepositoryCount();
    })(),
    await (async () => {
      await _sleep(2000);
      return fetchRepositoryCount();
    })(),
  );
  _writeData(
    "repos.json",
    JSON.stringify({ date: new Date().toISOString(), count: numRepos }),
  );

  const languageWithoutCounts = JSON.parse(_loadData("languages.json"));
  const languages = await fetchLanguageCounts(languageWithoutCounts);
  for (let i = 0; i < 5; i++) {
    await _sleep(2000);
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

  _writeData(
    "languages.json",
    JSON.stringify({ date: new Date().toISOString(), languages }),
  );
})();
