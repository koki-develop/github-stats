import axios from "axios";
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
  const resp = await sendRequest<UserCountResponse>(query);
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
  const resp = await sendRequest<OrganizationCountResponse>(query);
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
  const resp = await sendRequest<RepositoryCountResponse>(query);
  return resp.repo.repositoryCount;
};

const sendRequest = async <T>(query: string): Promise<T> => {
  const githubEndpointUrl = "https://api.github.com/graphql";
  const githubToken = process.env.GITHUB_TOKEN;

  const { data } = await rawRequest<T>(githubEndpointUrl, query, undefined, {
    authorization: `Bearer ${githubToken}`,
  });
  return data;
};
