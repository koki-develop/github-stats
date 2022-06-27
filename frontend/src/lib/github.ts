import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import { gql, rawRequest } from "graphql-request";
import yaml from "js-yaml";
import { Language, LanguageType } from "../models/language";

type LanguagesYaml = {
  [key: string]: {
    type: string;
    color: string;
  };
};

export const fetchLanguages = async (): Promise<Omit<Language, "count">[]> => {
  const endpoint =
    "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml";
  const { data } = await axios.get<string>(endpoint);
  const languagesYaml = yaml.load(data) as LanguagesYaml;

  return Object.entries(languagesYaml)
    .map(([name, { type, color }]) => ({
      name,
      type: type as LanguageType,
      color,
    }))
    .filter((language) => ["programming", "markup"].includes(language.type));
};

type UserCountResponse = {
  user: {
    userCount: number;
  };
};

export const fetchUserCount = async (): Promise<number> => {
  const query = gql`
    {
      user: search(type: USER, query: "type:user") {
        userCount
      }
    }
  `;
  const resp = await _sendRequest<UserCountResponse>(query);
  return resp.user.userCount;
};

type OrganizationCountResponse = {
  org: {
    userCount: number;
  };
};

export const fetchOrganizationCount = async (): Promise<number> => {
  const query = gql`
    {
      org: search(type: USER, query: "type:org") {
        userCount
      }
    }
  `;
  const resp = await _sendRequest<OrganizationCountResponse>(query);
  return resp.org.userCount;
};

type RepositoryCountResponse = {
  repo: {
    repositoryCount: number;
  };
};

export const fetchRepositoryCount = async (): Promise<number> => {
  const query = gql`
    {
      repo: search(type: REPOSITORY, query: "is:public") {
        repositoryCount
      }
    }
  `;
  const resp = await _sendRequest<RepositoryCountResponse>(query);
  return resp.repo.repositoryCount;
};

type LanguageCountResponse = {
  [key: string]: {
    repositoryCount: number;
  };
};

export const fetchLanguageCounts = async (
  languages: Omit<Language, "count">[]
): Promise<Language[]> => {
  const languageWithCounts: Language[] = [];

  while (languages.length > 0) {
    const nextLanguages = languages.splice(0, 50);
    const map = new Map<string, Omit<Language, "count">>(
      nextLanguages.map((language) => [`a${_md5(language.name)}`, language])
    );

    const query = gql`
{
  ${Array.from(map.entries())
    .map(([key, language]) => {
      return `${key}: search(type: REPOSITORY, query: "is:public language:\\"${language.name}\\"") { repositoryCount }`;
    })
    .join("\n")}
}
`;
    const resp = await _sendRequest<LanguageCountResponse>(query);
    languageWithCounts.push(
      ...Object.entries(resp).map(([key, { repositoryCount }]) => {
        const language = map.get(key);
        return { ...language, count: repositoryCount };
      })
    );
  }

  return languageWithCounts
    .filter((language) => language.count !== 0)
    .sort((a, b) => b.count - a.count);
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
