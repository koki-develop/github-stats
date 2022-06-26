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

export const fetchLanguages = async (): Promise<Language[]> => {
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

type NumUsersResponse = {
  user: {
    userCount: number;
  };
};

export const fetchNumUsers = async (): Promise<number> => {
  const query = gql`
    {
      user: search(type: USER, query: "type:user") {
        userCount
      }
    }
  `;
  const resp = await sendRequest<NumUsersResponse>(query);
  return resp.user.userCount;
};

type NumOrganizationsResponse = {
  org: {
    userCount: number;
  };
};

export const fetchNumOrganizations = async (): Promise<number> => {
  const query = gql`
    {
      org: search(type: USER, query: "type:org") {
        userCount
      }
    }
  `;
  const resp = await sendRequest<NumOrganizationsResponse>(query);
  return resp.org.userCount;
};

const sendRequest = async <T>(query: string): Promise<T> => {
  const githubEndpointUrl = "https://api.github.com/graphql";
  const githubToken = process.env.GITHUB_TOKEN;

  const { data } = await rawRequest<T>(githubEndpointUrl, query, undefined, {
    authorization: `Bearer ${githubToken}`,
  });
  return data;
};
