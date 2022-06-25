import axios from "axios";
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
