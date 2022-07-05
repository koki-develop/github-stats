import crypto from "crypto";
import axios from "axios";
import { gql, rawRequest } from "graphql-request";
import yaml from "js-yaml";
import { Language, LanguageWithoutCount } from "../models/language";

type LanguagesYaml = {
  [key: string]: {
    type: string;
    color: string;
  };
};

export const fetchLanguagesWithoutCount = async (): Promise<
  LanguageWithoutCount[]
> => {
  const endpoint =
    "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml";
  const { data } = await axios.get<string>(endpoint);
  const languagesYaml = yaml.load(data) as LanguagesYaml;

  const languages = Object.entries(languagesYaml).map(
    ([name, { type, color }]) => ({
      name,
      type,
      color,
    }),
  );

  return languages.filter(language =>
    ["programming", "markup"].includes(language.type),
  ) as Language[];
};

type UserCountResponse = {
  user: {
    userCount: number;
  };
};

export const fetchUserCount = async (): Promise<number> => {
  console.info("fetching user count...");
  const query = gql`
    {
      user: search(type: USER, query: "type:user") {
        userCount
      }
    }
  `;
  const resp = await _sendRequest<UserCountResponse>(query);
  const { userCount } = resp.user;
  console.info("fetched:", userCount);
  return userCount;
};

type OrganizationCountResponse = {
  org: {
    userCount: number;
  };
};

export const fetchOrganizationCount = async (): Promise<number> => {
  console.info("fetching organization count...");
  const query = gql`
    {
      org: search(type: USER, query: "type:org") {
        userCount
      }
    }
  `;
  const resp = await _sendRequest<OrganizationCountResponse>(query);
  const { userCount } = resp.org;
  console.info("fetched:", userCount);
  return userCount;
};

type RepositoryCountResponse = {
  repo: {
    repositoryCount: number;
  };
};

export const fetchRepositoryCount = async (): Promise<number> => {
  console.info("fetching repository count...");
  const query = gql`
    {
      repo: search(type: REPOSITORY, query: "is:public") {
        repositoryCount
      }
    }
  `;
  const resp = await _sendRequest<RepositoryCountResponse>(query);
  const { repositoryCount } = resp.repo;
  console.info("fetched:", repositoryCount);
  return resp.repo.repositoryCount;
};

type LanguageCountResponse = {
  [key: string]: {
    repositoryCount: number;
  };
};

export const fetchLanguageCounts = async (
  languages: Omit<Language, "count">[],
): Promise<Language[]> => {
  console.info("languages:", languages.length);
  const languageWithCounts: Language[] = [];
  const languagesClone = languages.concat();

  while (languagesClone.length > 0) {
    const nextLanguages = languagesClone.splice(0, 50);
    console.info("next:", JSON.stringify(nextLanguages));
    const map = new Map<string, Omit<Language, "count">>(
      nextLanguages.map(language => [`a${_md5(language.name)}`, language]),
    );
    console.info("fetching languages...");
    const query = gql`
{
  ${Array.from(map.entries())
    .map(([key, language]) => {
      return `${key}: search(type: REPOSITORY, query: "language:\\"${language.name}\\"") { repositoryCount }`;
    })
    .join("\n")}
}
`;
    const resp = await _sendRequest<LanguageCountResponse>(query);
    console.info("fetched.");
    languageWithCounts.push(
      ...Object.entries(resp).map(([key, { repositoryCount }]) => {
        const language = map.get(key);
        console.info(`${language.name}:`, repositoryCount);
        return { ...language, count: repositoryCount };
      }),
    );
  }

  return (
    languageWithCounts
      // .filter((language) => language.count !== 0)
      .sort((a, b) => b.count - a.count)
  );
};

const _sendRequest = async <T>(query: string): Promise<T> => {
  const githubEndpointUrl = "https://api.github.com/graphql";
  const githubToken = process.env.GITHUB_TOKEN;

  const { data } = await rawRequest<T>(githubEndpointUrl, query, undefined, {
    authorization: `Bearer ${githubToken}`,
  });
  return data;
};

const _md5 = (str: string): string => {
  return crypto.createHash("md5").update(str).digest("hex");
};
